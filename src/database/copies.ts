import {knexClient} from "./knexClient";

export const fetchCopiesOfBook = (bookId: number) => {
    return knexClient
        .select("*")
        .from("copy")
        .where("book_id", bookId);
}