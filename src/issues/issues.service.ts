import { sql } from "../db";
import type { IQuery, Issue, RIssue } from "../types";

class IssueService {
  async createIssue(payload: Issue & { reporter_id: number }): Promise<Issue> {
    const { title, description, type, reporter_id } = payload;
    const result = await sql`
        INSERT INTO issues (title, description, type, reporter_id)
        VALUES (${title}, ${description}, ${type}, ${reporter_id})
        RETURNING *
    `;

    return result[0] as Issue;
  }

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
}

export default new IssueService();
