import express from "express";
import {fetchCopyById, insertCopy, updateCopy} from "../database/copies";

const router = express.Router();

router.post("/new", async (request, response) => {
    const bookId = parseInt(request.body.bookId);
    await insertCopy(bookId);
    response.redirect(`/books/${bookId}`);
});

router.get("/:copyId/edit", async (request, response) => {
    const copyId = parseInt(request.params.copyId);
    const copy = await fetchCopyById(copyId);
    response.render("copies/edit_copy.njk", copy);
});

router.post("/:copyId/edit", async (request, response) => {
    const copyId = parseInt(request.params.copyId);
    const updatedCopy = await updateCopy(copyId, request.body);
    response.redirect(`/books/${updatedCopy.book_id}`);
});

export default router;