export interface CreateBookRequest {
    title: string;
    author: string;
    isbn: string | null;
    coverImageUrl: string | null;
    publisher: string | null;
    publishDate: string | null;
}