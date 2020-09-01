import express from "express";
import {hashPassword} from "../services/auth";
import {RegisterRequest, SignInRequest} from "../models/requestModels";
import {insertMember} from "../database/members";
import {validatePassword} from "../services/validations";
import passport from "passport";

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

router.post("/sign-in", passport.authenticate('local', {
        successRedirect: "/books",
        failureRedirect: "/auth/sign-in",
    })
);

router.get("/sign-in-with-github", 
    passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', 
    passport.authenticate('github', { failureRedirect: '/auth/sign-in', successRedirect: "/books" }))

export default router;