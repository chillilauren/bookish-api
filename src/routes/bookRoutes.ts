import express from "express";
import {deleteBook, fetchAllBooks, fetchBookById, insertBook, reinstateBook, updateBook} from "../database/books";
import {BookRequest} from "../models/requestModels";
import {lookupBook} from "../services/openLibrary";
import {fetchCopiesOfBook} from "../database/copies";

const router = express.Router();

router.get('/', async (request, response) => {
    if (!request.user) {
        response.statusCode = 401
        response.send("Not Authorised");
        return;
    }

    const search = request.query.search || "";
    const page = request.query.page ? parseInt(request.query.page as string) : 1;
    const model = { 
        books: await fetchAllBooks(search as string, page),
        search: search,
        page: page
    }
    response.render("books/all_books.njk", model);
});

router.get('/new', (request, response) => {
    response.render("books/new_book.njk");
});

router.post('/new', async (request, response) => {
    const newBook = request.body as BookRequest;
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
    const model = {
        book: await fetchBookById(bookId),
        copies: await fetchCopiesOfBook(bookId),
    }
    response.render("books/single_book.njk", model);
});

export default router;