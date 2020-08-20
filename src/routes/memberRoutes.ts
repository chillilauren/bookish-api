import express from "express";
import {deleteMember, fetchAllMembers, fetchMemberById, insertMember, updateMember} from "../database/members";
import {MemberRequest} from "../models/requestModels";
import {fetchBooksCheckedOutByMember} from "../database/checkouts";

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
    const newMember = request.body as MemberRequest;
    const newMemberId = await insertMember(newMember);
    response.redirect(`/members/${newMemberId}`); 
});

router.get('/:memberId', async (request, response) => {
    const memberId = parseInt(request.params.memberId);
    const model = {
        member:  await fetchMemberById(memberId),
        checkedOutBooks: await fetchBooksCheckedOutByMember(memberId),
    }
    response.render("members/single_member.njk", model);
});

router.get('/:memberId/edit', async (request, response) => {
    const memberId = parseInt(request.params.memberId);
    const member = await fetchMemberById(memberId);
    response.render("members/edit_member.njk", member);
});

router.post('/:memberId/edit', async (request, response) => {
    const memberId = parseInt(request.params.memberId);
    await updateMember(memberId, request.body);
    response.redirect(`/members/${memberId}`);
});

router.post('/:memberId/delete', async (request, response) => {
    const memberId = parseInt(request.params.memberId);
    await deleteMember(memberId);
    response.redirect(`/members/${memberId}`);
});

export default router;