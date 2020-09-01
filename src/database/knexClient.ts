﻿import knex from "knex";

export const knexClient = knex({
   client: "pg",
    debug: true,
   connection: {
       host: "localhost",
       database: process.env.POSTGRES_DATABASE,
       user: process.env.POSTGRES_USER,
       password: process.env.POSTGRES_PASSWORD
   } 
});

export const PAGE_SIZE = 10;