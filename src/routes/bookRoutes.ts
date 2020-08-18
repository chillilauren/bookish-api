import express from "express";
import {fetchAllBooks} from "../database/books";

const router = express.Router();

router.get('/', async (request, response) => {
    const model = { 
        books: await fetchAllBooks()
    }
    response.render("books/all_books.njk", model);
})

export default router;