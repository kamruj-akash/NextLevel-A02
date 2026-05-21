import type { JwtPayload } from "jsonwebtoken";
import { pool } from "../db";
import {
  BUG_TYPES,
  STATUSES,
  type IQuery,
  type Issue,
  type Reporter,
  type RIssue,
  type RRIssue,
} from "../types";
import AppError from "../utils/AppError";

class IssueService {
  // create issue
  async createIssue(payload: Issue & { reporter_id: number }): Promise<Issue> {
    const { title, description, type, reporter_id } = payload;
    if (!title || !description || !type || !reporter_id) {
      throw new AppError("All fields are required", 400);
    }
    if (!BUG_TYPES.includes(type)) {
      console.log(!BUG_TYPES.includes(type));
      throw new AppError(
        "only 'byg' or 'feature_request' types are allowed",
        400,
      );
    }

    const result = await pool.query(
      `
        INSERT INTO issues (title, description, type, reporter_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `,
      [title, description, type, reporter_id],
    );

    return result.rows[0] as Issue;
  }
  // get all issues
  async getAllIssue(query: IQuery): Promise<RIssue[]> {
    const { sort, type, status } = query;
    const sortDirection = sort?.toLowerCase() === "oldest" ? "ASC" : "DESC";

    const conditions: string[] = [];
    const values: unknown[] = [];

    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }
    if (type) {
      values.push(type);
      conditions.push(`type = $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const issuesResult = await pool.query(
      `
    SELECT *
    FROM issues
    ${whereClause}
    ORDER BY created_at ${sortDirection}
  `,
      values,
    );
    const issues = issuesResult.rows;
    if (issues.length === 0) return [];

    const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

    const reportersResult = await pool.query(
      `
                          SELECT id, name, role
                          FROM users
                          WHERE id = ANY($1)
      `,
      [reporterIds],
    );
    const reporters = reportersResult.rows;

    issues.forEach((issue) => {
      const reporter = reporters.find((r) => r.id === issue.reporter_id);
      if (reporter) {
        issue.reporter = {
          id: reporter.id,
          name: reporter.name,
          role: reporter.role,
        };
      }
    });

    return issues as RIssue[];
  }

  // get single issue
  async getSingleIssue(id: number): Promise<RIssue> {
    const issueRows = (
      await pool.query(
        `
    SELECT *
    FROM issues
    WHERE id = $1;
  `,
        [id],
      )
    ).rows as RRIssue[];

    if (issueRows.length === 0) {
      throw new AppError(`Issue with id ${id} not found`, 404);
    }

    const issue = issueRows[0]!;
    const reporterRows = (
      await pool.query(
        `
    SELECT id, name, role
    FROM users
    WHERE id = $1;
  `,
        [issue.reporter_id],
      )
    ).rows as Reporter[];

    if (reporterRows.length === 0) {
      throw new Error(`Reporter with id ${issue.reporter_id} not found`);
    }

    const reporter = reporterRows[0]!;

    const { reporter_id, ...rest } = issue;

    return {
      ...rest,
      reporter,
    } as RIssue;
  }

  // update issue
  async updateIssue(id: number, payload: Issue, user: JwtPayload) {
    const { title, description, type, status } = payload;

    if (!title && !description && !type && !status) {
      throw new AppError("At least one field is required", 400);
    }
    if (type && !BUG_TYPES.includes(type)) {
      console.log(!BUG_TYPES.includes(type));
      throw new AppError(
        "only 'bug' or 'feature_request' types are allowed",
        400,
      );
    }

    if (status && !STATUSES.includes(status)) {
      throw new AppError(
        "only 'open', 'in_progress' or 'resolved' statuses are allowed",
        400,
      );
    }

    if (user.role !== "maintainer") {
      if (status) {
        throw new AppError("Only maintainers can update status", 403);
      }
      const issueFromDb = await this.getSingleIssue(id);
      if (issueFromDb.status !== "open") {
        throw new AppError("Only open issues can be updated!", 403);
      }

      if (issueFromDb.reporter.id !== user.id) {
        throw new AppError("You are not authorized to update this issue", 403);
      }
      const result = await pool.query(
        `
                        UPDATE issues
                        SET
                          title = COALESCE($1, title),
                          description = COALESCE($2, description),
                          type = COALESCE($3, type),
                          updated_at = NOW()
                        WHERE id = $4
                        RETURNING *
                      `,
        [title ?? null, description ?? null, type ?? null, id],
      );
      return result.rows[0] as Issue;
    }

    const result = await pool.query(
      `
                        UPDATE issues
                        SET
                          title = COALESCE($1, title),
                          description = COALESCE($2, description),
                          type = COALESCE($3, type),
                          status = COALESCE($4, status),
                          updated_at = NOW()
                        WHERE id = $5
                        RETURNING *
                      `,
      [title ?? null, description ?? null, type ?? null, status ?? null, id],
    );
    return result.rows[0] as Issue;
  }

  // delete issue
  async deleteIssue(id: number) {
    const result = await pool.query(
      `
                        DELETE FROM issues
                        WHERE id = $1
                        RETURNING *
                      `,
      [id],
    );
    return result.rows[0] as Issue;
  }
}

export default new IssueService();
