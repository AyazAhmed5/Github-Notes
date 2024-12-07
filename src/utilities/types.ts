export interface publicGistInterface {
  id: string;
  description: string;
  url: string;
  public: boolean;
  owner: { login: string; avatar_url: string };
  updated_at: string;
}
