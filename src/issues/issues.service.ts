import type { JwtPayload } from "jsonwebtoken";
import { sql } from "../db";
import {
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
    const result = await sql`
        INSERT INTO issues (title, description, type, reporter_id)
        VALUES (${title}, ${description}, ${type}, ${reporter_id})
        RETURNING *
    `;

    return result[0] as Issue;
  }
  // get all issues
  async getAllIssue(query: IQuery): Promise<RIssue[]> {
    const { sort, type, status } = query;
    const sortDirection =
      sort?.toLowerCase() === "oldest" ? sql`ASC` : sql`DESC`;
    const issues = await sql`
    SELECT *
    FROM issues
    WHERE 1=1
      ${status ? sql`AND status = ${status}` : sql``}
      ${type ? sql`AND type = ${type}` : sql``}
    ORDER BY created_at ${sortDirection}
  `;
    if (issues.length === 0) return [];

    const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];
    const reporters = await sql`
                          SELECT id, name, role
                          FROM users
                          WHERE id = ANY(${reporterIds})
                          `;

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
    const issueRows = (await sql`
    SELECT *
    FROM issues
    WHERE id = ${id};
  `) as RRIssue[];

    if (issueRows.length === 0) {
      throw new AppError(`Issue with id ${id} not found`, 404);
    }

    const issue = issueRows[0]!;
    const reporterRows = (await sql`
    SELECT id, name, role
    FROM users
    WHERE id = ${issue.reporter_id};
  `) as Reporter[];

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

    if (user.role !== "maintainer") {
      const issueFromDb = await this.getSingleIssue(id);
      if (issueFromDb.status !== "open") {
        throw new AppError("Only open issues can be updated!", 403);
      }

      if (issueFromDb.reporter.id !== user.id) {
        throw new AppError("You are not authorized to update this issue", 403);
      }
      const result = await sql`
                        UPDATE issues
                        SET 
                          title = COALESCE(${title ?? null}, title),
                          description = COALESCE(${description ?? null}, description),
                          type = COALESCE(${type ?? null}, type),
                          updated_at = NOW()
                        WHERE id = ${id}
                        RETURNING *
                      `;
      return result[0] as Issue;
    }

    const result = await sql`
                        UPDATE issues
                        SET 
                          title = COALESCE(${title ?? null}, title),
                          description = COALESCE(${description ?? null}, description),
                          type = COALESCE(${type ?? null}, type),
                          status = COALESCE(${status ?? null}, status),
                          updated_at = NOW()
                        WHERE id = ${id}
                        RETURNING *
                      `;
    return result[0] as Issue;
  }

  // delete issue
  async deleteIssue(id: number) {
    const result = await sql`
                        DELETE FROM issues
                        WHERE id = ${id}
                        RETURNING *
                      `;
    return result[0] as Issue;
  }
}

export default new IssueService();
