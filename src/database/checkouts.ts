import {knexClient} from "./knexClient";

export const checkoutCopy = async (memberId: number, copyId: number) => {
    if (!await isAvailable(copyId)) {
        throw Error("That copy is already taken");
    }
    
    await knexClient
        .insert({
            member_id: memberId,
            copy_id: copyId,
            out_date: knexClient.fn.now(),
        })
        .into("checkout");
}


const isAvailable = async (copyId: number) => {
    const unreturnedCopies = await knexClient
        .select("*")
        .from("checkout")
        .where("copy_id", copyId)
        .andWhere("in_date", null);
    
    return unreturnedCopies.length === 0;
} 

export const checkinCopy = async (checkoutId: number) => {
    const updatedRows = await knexClient("checkout")
        .update({ in_date: knexClient.fn.now() })
        .where("id", checkoutId)
        .returning("*");
    
    return updatedRows[0];
}

export const fetchBooksCheckedOutByMember = (memberId: number) => {
    return knexClient
        .select(["book.id as book_id", "book.title", "book.author", "book.cover_image_url", "checkout.id as checkout_id", "checkout.out_date", "checkout.in_date"])
        .from("book")
        .join("copy", "copy.book_id", "book.id")
        .join("checkout", "checkout.copy_id", "copy.id")
        .join("member", "checkout.member_id", "member.id")
        .where("member.id", memberId)
        .orderBy("checkout.out_date", "desc");
}