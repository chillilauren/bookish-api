﻿import { knexClient } from "./knexClient";
import {Book} from "../models/databaseModels";
import {EditBookRequest} from "../models/requestModels";

export const fetchAllBooks = () => {
    return knexClient
        .select("*")
        .from<Book>("book")
        .where("deleted", false);
}

export const fetchBookById = (bookId: number) => {
    return knexClient
        .select("*")
        .from<Book>("book")
        .where("id", bookId)
        .first();
}

export const insertBook = async (book: EditBookRequest) => {
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

export const updateBook = async (id: number, book: EditBookRequest) => {
    await knexClient("book")
        .update({
            title: book.title,
            author: book.author,
            cover_image_url: book.coverImageUrl,
            published_date: book.publishDate,
            publisher: book.publisher,
            isbn: book.isbn
        })
        .where("id", id)
}

export const deleteBook = async (id: number) => {
    await knexClient("book")
        .update("deleted", true)
        .where("id", id);
}

export const reinstateBook = async (id: number) => {
    await knexClient("book")
        .update("deleted", false)
        .where("id", id);
}