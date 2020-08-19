import express from "express";
import {fetchAllMembers, fetchMemberById, insertMember} from "../database/members";
import {EditMemberRequest} from "../models/requestModels";

const router = express.Router();

router.get('/', async (request, response) => {
    const search = request.query.search || "";
    const page = request.query.page ? parseInt(request.query.page as string) : 1;
    const model = {
        members: await fetchAllMembers(search as string, page),
        search: search,
        page: page
    }
    response.render("members/all_members.njk", model);
});

router.get('/new', async (request, response) => {
    response.render("members/new_member.njk"); 
});

router.post('/new', async (request, response) => {
    const newMember = request.body as EditMemberRequest;
    const newMemberId = await insertMember(newMember);
    response.redirect(`/members/${newMemberId}`); 
});

router.get('/:memberId', async (request, response) => {
    const memberId = parseInt(request.params.memberId);
    const member = await fetchMemberById(memberId);
    response.render("members/single_member.njk", member);
});

export default router;