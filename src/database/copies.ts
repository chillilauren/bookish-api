import {knexClient} from "./knexClient";
import {CopyRequest} from "../models/requestModels";

export const fetchCopiesOfBook = async (bookId: number) => {
    const all = await knexClient
        .select("*")
        .from("copy")
        .where("book_id", bookId);
    
    const onLoan = await knexClient
        .select(["checkout.id as id", "member.id as member_id", "copy.id as copy_id", "condition", "status"])
        .from("copy")
        .join("checkout", "checkout.copy_id", "copy.id")
        .join("member", "checkout.member_id", "member.id")
        .where("book_id", bookId)
        .andWhere("in_date", "is", null);
    
    const inactive = await knexClient
        .select("*")
        .from("copy")
        .where("book_id", bookId)
        .andWhere("status",  "!=", "ACTIVE");
    
    const onLoadIds = onLoan.map(copy => copy.id);
    const inactiveIds = inactive.map(copy => copy.id);
    
    const availableCopies = all
        .filter(copy => !onLoadIds.includes(copy.id))
        .filter(copy => !inactiveIds.includes(copy.id));
    
    return {
        all: all,
        available: availableCopies,
        onLoan: onLoan,
        inactive: inactive,
    }
}

export const insertCopy = async (bookId: number) => {
    const insertedIds = await knexClient
        .insert({
            book_id: bookId,
            condition: "NEW",
            status: "ACTIVE",
        })
        .into("copy")
        .returning("*");
    
    return insertedIds[0];
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