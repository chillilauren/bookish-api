import {knexClient, PAGE_SIZE} from "./knexClient";
import {EditMemberRequest} from "../models/requestModels";

export const fetchAllMembers = (search: string, page: number) => {
    return knexClient
        .select("*")
        .from("member")
        .where("deleted", false)
        .andWhere(builder => {
            builder
                .where("name", "ILIKE", `%${search}%`)
                .orWhere("email", "ILIKE", `%${search}%`);
        })
        .offset(PAGE_SIZE * (page - 1))
        .limit(PAGE_SIZE);
}

export const fetchMemberById = (id: number) => {
    return knexClient
        .select("*")
        .from("member")
        .where("id", id)
        .first();
}

export const insertMember = async (member: EditMemberRequest) => {
    const insertedIds = await knexClient
        .insert({
            name: member.name,
            email: member.email,
        })
        .into("member")
        .returning("id");

    return insertedIds[0];
}

export const updateMember = async (id: number, member: EditMemberRequest) => {
    await knexClient("member")
        .update({
            name: member.name,
            email: member.email,
        })
        .where("id", id);
}