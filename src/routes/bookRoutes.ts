import express from "express";
import {deleteBook, fetchAllBooks, fetchBookById, insertBook, reinstateBook, updateBook} from "../database/books";
import {EditBookRequest} from "../models/requestModels";
import {lookupBook} from "../services/openLibrary";

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
    const newBook = request.body as EditBookRequest;
    const newBookId = await insertBook(newBook);
    response.redirect(`/books/${newBookId}`);
});

router.post('/new-by-isbn', async (request, response) => {
    const isbn = request.body.isbn;
    const newBook = await lookupBook(isbn);
    const newBookId = await insertBook(newBook);
    response.redirect(`/books/${newBookId}`);
});

router.get('/:bookId/edit', async (request, response) => {
    const bookId = parseInt(request.params.bookId);
    const book = await fetchBookById(bookId);
    response.render("books/edit_book.njk", book);
});

router.post('/:bookId/edit', async (request, response) => {
    const bookId = parseInt(request.params.bookId);
    await updateBook(bookId, request.body);
    response.redirect(`/books/${bookId}`);
});

router.post('/:bookId/delete', async (request, response) => {
    const bookId = parseInt(request.params.bookId);
    await deleteBook(bookId);
    response.redirect(`/books/${bookId}`);
});

router.post('/:bookId/reinstate', async (request, response) => {
    const bookId = parseInt(request.params.bookId);
    await reinstateBook(bookId);
    response.redirect(`/books/${bookId}`);
});

router.get('/:bookId', async (request, response) => {
    const bookId = parseInt(request.params.bookId);
    const book = await fetchBookById(bookId);
    response.render("books/single_book.njk", book);
});

export default router;