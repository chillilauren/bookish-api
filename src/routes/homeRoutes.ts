import express from "express";

const router = express.Router();

router.get('/', (request, response) => {
    response.render("members/all_members.njk");
})

export default router;