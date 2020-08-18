import { knexClient } from "./knexClient";
import {Book} from "../models/databaseModels";

export const fetchAllBooks = () => {
    return knexClient
        .select("*")
        .from<Book>("book");
}

export const fetchBookById = (bookId: number) => {
    return knexClient
        .select("*")
        .from<Book>("book")
        .where("id", bookId);
}