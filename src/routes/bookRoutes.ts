import express from "express";
import {deleteBook, fetchAllBooks, fetchBookById, insertBook, reinstateBook, updateBook} from "../database/books";
import {BookRequest} from "../models/requestModels";
import {lookupBook} from "../services/openLibrary";
import {fetchCopiesOfBook} from "../database/copies";

const router = express.Router();

router.get('/', async (request, response) => {
    const search = request.query.search || "";
    const page = request.query.page ? parseInt(request.query.page as string) : 1;
    const model = { 
        books: await fetchAllBooks(search as string, page),
        search: search,
        page: page
    };
    response.json(model);
});

router.post('/new', async (request, response) => {
    const newBook = request.body as BookRequest;
    const book = await insertBook(newBook);
    response.json(book);
});

router.post('/new-by-isbn', async (request, response) => {
    const isbn = request.body.isbn;
    const bookDetails = await lookupBook(isbn);
    const book = await insertBook(bookDetails);
    response.json(book);
});

router.get('/by-isbn/:isbn', async (request, response) => {
    const isbn = request.params.isbn;
    const bookDetails = await lookupBook(isbn);
    response.json(bookDetails);
});

router.post('/:bookId', async (request, response) => {
    const bookId = parseInt(request.params.bookId);
    const book = await updateBook(bookId, request.body);
    response.json(book);
});

router.delete('/:bookId/delete', async (request, response) => {
    const bookId = parseInt(request.params.bookId);
    await deleteBook(bookId);
    response.json({id: bookId});
});

router.post('/:bookId/reinstate', async (request, response) => {
    const bookId = parseInt(request.params.bookId);
    await reinstateBook(bookId);
    response.json({id: bookId});
});

router.get('/:bookId', async (request, response) => {
    const bookId = parseInt(request.params.bookId);
    const model = {
        book: await fetchBookById(bookId),
        copies: await fetchCopiesOfBook(bookId),
    }
    response.json(model);
});

export default router;