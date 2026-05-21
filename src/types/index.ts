export const roles = ["contributor", "maintainer"] as const;
export type Role = (typeof roles)[number];

export type User = {
  name: string;
  email: string;
  role: Role;
  password: string;
};

export type RUser = Omit<User, "password"> & {
  id: number;
  created_at: string;
  updated_at: string;
};

// issues types
export type Reporter = {
  id: number;
  name: string;
  role: string;
};

export type Issue = {
  title: string;
  description: string;
  type: string;
  status?: string;
};

export type RIssue = Issue & {
  id: number;
  status: string;
  reporter: Reporter;
  created_at: string;
  updated_at: string;
};

export type RRIssue = Omit<RIssue, "reporter"> & {
  reporter_id: number;
};

// issues interface
// export interface IJwtPayload {
//   id: number;
//   name: string;
//   role: "contributor" | "maintainer";
// }

// export interface IJwtResponse extends IJwtPayload {
//   iat: number;
//   exp: number;
// }

export interface IQuery {
  sort?: "newest" | "oldest";
  type?: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
}
