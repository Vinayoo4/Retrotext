export interface User {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface Session {
  id: string;
  name: string;
  content: string;
  themeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExportedSession {
  version: string;
  session: Omit<Session, 'id'>;
  exportedAt: string;
}
