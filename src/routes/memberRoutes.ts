import express from "express";
import {deleteMember, fetchAllMembers, fetchMemberById, insertMember, updateMember} from "../database/members";
import {fetchBooksCheckedOutByMember} from "../database/checkouts";
import {RegisterRequest} from "../models/requestModels";

const router = express.Router();

router.get('/', async (request, response) => {
    const search = request.query.search || "";
    const page = request.query.page ? parseInt(request.query.page as string) : 1;
    const model = {
        members: await fetchAllMembers(search as string, page),
        search: search,
        page: page
    }
    response.json(model);
});

router.get('/:memberId', async (request, response) => {
    const memberId = parseInt(request.params.memberId);
    const model = {
        member:  await fetchMemberById(memberId),
        checkedOutBooks: await fetchBooksCheckedOutByMember(memberId),
    }
    response.json(model);
});

router.post("/new", async (request, response) => {
   const newMember = request.body as RegisterRequest;
   const member = await insertMember(newMember);
   response.json(member);
});

router.post('/:memberId/edit', async (request, response) => {
    const memberId = parseInt(request.params.memberId);
    const member = await updateMember(memberId, request.body);
    response.json(member);
});

router.delete('/:memberId/delete', async (request, response) => {
    const memberId = parseInt(request.params.memberId);
    await deleteMember(memberId);
    response.json({ id: memberId });
});

export default router;