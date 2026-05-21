import { sql } from "../db";
import type { Issue } from "../types";

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

  async getAllIssue(): Promise<Issue[]> {
    const result = await sql`SELECT * FROM issues`;
    return result as Issue[];
  }
}

export default new IssueService();
