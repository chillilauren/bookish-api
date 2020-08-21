import express from "express";
import {hashPassword} from "../services/auth";
import {RegisterRequest} from "../models/requestModels";
import {insertMember} from "../database/members";

const router = express.Router();

router.get("/register", (request, response) => {
    response.render("auth/register.njk");
})

router.post("/register", async (request, response) => {
    const registerRequest = request.body as RegisterRequest;
    const hashResult = hashPassword(registerRequest.password);
    
    const memberId = await insertMember({
        name: registerRequest.name,
        email: registerRequest.email,
        hashedPassword: hashResult.hashedPassword,
        salt: hashResult.salt
    })
    response.redirect(`/members/${memberId}`);
})

export default router;