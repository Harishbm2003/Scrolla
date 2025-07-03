export interface Book {
  id: number;
  title: string;
  image?: string; // for local images
  cover_image?: string; // for remote images
  author_id?: number;
  author?: string;
  pages?: number;
  releaseDate?: string;
  isbn?: string;
}

