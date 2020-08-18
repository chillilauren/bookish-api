import express from "express";
import {fetchAllBooks, fetchBookById} from "../database/books";

const router = express.Router();

router.get('/', async (request, response) => {
    const model = { 
        books: await fetchAllBooks()
    }
    response.render("books/all_books.njk", model);
})

router.get('/:bookId', async (request, response) => {
    const bookId = parseInt(request.params.bookId);
    const book = await fetchBookById(bookId);
    response.render("books/single_book.njk", book);
})

export default router;