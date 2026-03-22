export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  label: string;
  color: string;
}
