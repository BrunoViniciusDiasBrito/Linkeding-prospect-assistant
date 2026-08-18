export interface Search {
  id: string;
  name: string;
  url: string;
  cargo?: string | null;
  senioridade?: string | null;
  location?: string | null;
  createdAt: string;
}

export type SearchPayload = Omit<Search, 'id' | 'createdAt'>;
