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
};

export type RIssue = Issue & {
  id: number;
  status: string;
  reporter: Reporter;
  created_at: string;
  updated_at: string;
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
