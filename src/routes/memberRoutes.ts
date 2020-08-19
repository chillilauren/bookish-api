import express from "express";
import {fetchAllMembers} from "../database/members";

const router = express.Router();

router.get('/', async (request, response) => {
    const search = request.query.search || "";
    const page = request.query.page ? parseInt(request.query.page as string) : 1;
    const model = {
        members: await fetchAllMembers(search as string, page),
        search: search,
        page: page
    }
    response.render("books/all_members.njk", model);
});

export default router;