import express from "express";
import {checkPassword, hashPassword} from "../services/auth";
import {RegisterRequest, SignInRequest} from "../models/requestModels";
import {insertMember} from "../database/members";
import {validatePassword} from "../services/validations";

const router = express.Router();

router.get("/register", (request, response) => {
    response.render("auth/register.njk");
})

router.post("/register", async (request, response) => {
    const registerRequest = request.body as RegisterRequest;
    
    if (!validatePassword(registerRequest.password)) {
        response.render("auth/register.njk", { error: "PASSWORD_VALIDATION", ...registerRequest })
    }
    
    const hashResult = hashPassword(registerRequest.password);
    
    try {
        const memberId = await insertMember({
            name: registerRequest.name,
            email: registerRequest.email,
            hashedPassword: hashResult.hashedPassword,
            salt: hashResult.salt
        });
        response.redirect(`/members/${memberId}`);
    }
    catch {
        response.render("auth/register.njk", { error: "EMAIL_TAKEN", ...registerRequest })
    }
    
});

router.get("/sign-in", (request, response) => {
    response.render("auth/sign-in.njk");
})

router.post("/sign-in", async (request, response) => {
    const signInRequest = request.body as SignInRequest;
    
    if (await checkPassword(signInRequest)) {
        response.redirect("/books");
    } else {
        response.render("auth/sign-in.njk", { incorrectLogin: true, ...signInRequest })
    }
});

export default router;