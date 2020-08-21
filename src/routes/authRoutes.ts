import express from "express";
import {checkPassword, hashPassword} from "../services/auth";
import {RegisterRequest, SignInRequest} from "../models/requestModels";
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
});

router.get("/sign-in", (request, response) => {
    response.render("auth/sign-in.njk");
})

router.post("/sign-in", async (request, response) => {
    const signInRequest = request.body as SignInRequest;
    
    if (await checkPassword(signInRequest)) {
        response.send("Successfully Logged in");
    } else {
        response.send("Incorrect Email or Password");
    }
});

export default router;