import {knexClient} from "./knexClient";
import {CopyRequest} from "../models/requestModels";

export const fetchCopiesOfBook = (bookId: number) => {
    return knexClient
        .select("*")
        .from("copy")
        .where("book_id", bookId);
}

export const insertCopy = (bookId: number) => {
    return knexClient
        .insert({
            book_id: bookId,
            condition: "NEW",
            status: "ACTIVE",
        })
        .into("copy");
}

export const fetchCopyById = (id: number) => {
    return knexClient
        .select("*")
        .from("copy")
        .where("id", id)
        .first();
}

export const updateCopy = async (id: number, copy: CopyRequest) => {
    const updatedRows = await knexClient("copy")
        .update({
            condition: copy.condition,
            status: copy.status,
        })
        .where("id", id)
        .returning("*");
    
    return updatedRows[0];
}