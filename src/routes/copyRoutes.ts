import express from "express";
import {fetchCopyById, insertCopy, updateCopy} from "../database/copies";

const router = express.Router();

router.post("/new", async (request, response) => {
    const bookId = parseInt(request.body.bookId);
    const copy = await insertCopy(bookId);
    response.json(copy);
});

router.post("/:copyId/edit", async (request, response) => {
    const copyId = parseInt(request.params.copyId);
    const updatedCopy = await updateCopy(copyId, request.body);
    response.json(updatedCopy);
});

export default router;