import {knexClient, PAGE_SIZE} from "./knexClient";
import {RegisterRequest} from "../models/requestModels";

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

export const fetchMemberByEmail = (email: string) => {
    return knexClient
        .select("*")
        .from("member")
        .where("email", email)
        .first();
}

interface Member {
    name: string;
    email: string;
    hashedPassword: string;
    salt: string;
}

export const insertMember = async (member: Member) => {
    const insertedIds = await knexClient
        .insert({
            name: member.name,
            email: member.email,
            hashed_password: member.hashedPassword,
            salt: member.salt,
        })
        .into("member")
        .returning("id");

    return insertedIds[0];
}

export const updateMember = async (id: number, member: RegisterRequest) => {
    await knexClient("member")
        .update({
            name: member.name,
            email: member.email,
        })
        .where("id", id);
}

export const deleteMember = async (id: number) => {
    await knexClient("member")
        .update({
            name: "REDACTED",
            email: `REDACTED_${id}`,
            deleted: true,
        })
        .where("id", id);
}