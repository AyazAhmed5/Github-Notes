export interface publicGistInterface {
  id: string;
  description: string;
  created_at: string;
  url: string;
  public: boolean;
  owner: { login: string; avatar_url: string };
  updated_at: string;
  files: {
    [fileName: string]: {
      filename: string;
      language: string | null;
      raw_url: string;
      size: number;
      type: string;
    };
  };
}

export interface User {
  uid: string | null;
  email: string | null;
  name: string | null;
  token: string | null;
  photoUrl: string | null;
}
