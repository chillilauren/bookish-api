import { knexClient } from "./knexClient";
import {Book} from "../models/databaseModels";
import {CreateBookRequest} from "../models/requestModels";

export const fetchAllBooks = () => {
    return knexClient
        .select("*")
        .from<Book>("book");
}

export const fetchBookById = (bookId: number) => {
    return knexClient
        .select("*")
        .from<Book>("book")
        .where("id", bookId)
        .first();
}

export const insertBook = async (book: CreateBookRequest) => {
    const insertedIds = await knexClient
        .insert({
            title: book.title,
            cover_image_url: book.coverImageUrl,
            published_date: book.publishDate,
            publisher: book.publisher,
            isbn: book.isbn,
            author: book.author
        })
        .into<Book>("book")
        .returning("id");
    
    return insertedIds[0];
}