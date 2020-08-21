export interface BookRequest {
    title: string;
    author: string;
    isbn: string | null;
    coverImageUrl: string | null;
    publisher: string | null;
    publishDate: string | null;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface CopyRequest {
    condition: "NEW" | "USED" | "POOR";
    status: "ACTIVE" | "LOST" | "REMOVED";
}

export interface CheckoutRequest {
    copyId: number;
    memberId: number | undefined;
    email: string | undefined
}