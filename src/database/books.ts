import { knexClient } from "./knexClient";
import {Book} from "../models/databaseModels";

export const fetchAllBooks = () => {
    return knexClient
        .select("*")
        .from<Book>("book");
}