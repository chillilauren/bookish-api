﻿import {knexClient, PAGE_SIZE} from "./knexClient";
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

export const fetchMemberByEmail = async (email: string) => {
    return knexClient
        .select("*")
        .from<Member>("member")
        .where("email", email)
        .first();
}

export interface Member {
    id: number;
    name: string;
    email: string;
    hashed_password: string;
    salt: string;
    delete: boolean;
}

export const insertMember = async (member: RegisterRequest) => {
    const insertedRows = await knexClient
        .insert({
            name: member.name,
            email: member.email,
        })
        .into("member")
        .returning("*");

    return insertedRows[0];
}

export const updateMember = async (id: number, member: RegisterRequest) => {
    const insertedRows = await knexClient("member")
        .update({
            name: member.name,
            email: member.email,
        })
        .where("id", id)
        .returning("*");
    
        return insertedRows[0];
    }
    
    export const deleteMember = async (id: number) => {
        await knexClient("member")
            .update({
                name: "REDACTED",
                email: `REDACTED_${id}`,
                salt: "DELETED",
                hashed_password: "DELETED",
                deleted: true,
            })
            .where("id", id);
    }