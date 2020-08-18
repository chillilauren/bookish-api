﻿import knex from "knex";

export const knexClient = knex({
   client: "pg",
   connection: {
       host: "localhost",
       database: "bookish",
       user: "postgres",
       password: process.env.POSTGRES_PASSWORD
   } 
});