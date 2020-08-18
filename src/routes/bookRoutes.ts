import express from "express";
import {fetchAllBooks, fetchBookById, insertBook} from "../database/books";
import {CreateBookRequest} from "../models/requestModels";

const router = express.Router();

router.get('/', async (request, response) => {
    const model = { 
        books: await fetchAllBooks()
    }
    response.render("books/all_books.njk", model);
});

router.get('/new', (request, response) => {
    response.render("books/new_book.njk");
});

router.post('/new', async (request, response) => {
    const newBook = request.body as CreateBookRequest;
    const newBookId = await insertBook(newBook);
    response.redirect(`/books/${newBookId}`);
});

router.get('/:bookId', async (request, response) => {
    const bookId = parseInt(request.params.bookId);
    const book = await fetchBookById(bookId);
    console.log(book);
    response.render("books/single_book.njk", book);
});

export default router;