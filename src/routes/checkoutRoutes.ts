import express from "express";
import {CheckoutRequest} from "../models/requestModels";
import {checkinCopy, checkoutCopy} from "../database/checkouts";
import {fetchMemberByEmail} from "../database/members";

const router = express.Router();

router.post('/new', async (request, response) => {
    const checkout = request.body as CheckoutRequest;
    await checkoutCopy(checkout.memberId!, checkout.copyId);
    response.redirect(`/members/${checkout.memberId}`);
});

router.post('/new-by-email', async (request, response) => {
    const checkout = request.body as CheckoutRequest;
    const member = await fetchMemberByEmail(checkout.email!);
    if (!member) {
        throw Error(`no user found matching email: ${checkout.email}`)
    }
    await checkoutCopy(member.id, checkout.copyId);
    response.redirect(`/members/${member.id}`);
});

router.post('/:checkoutId/checkin', async (request, response) => {
    const checkoutId = parseInt(request.params.checkoutId);
    const updatedCopy = await checkinCopy(checkoutId);
    console.log(updatedCopy);
    response.redirect(`/members/${updatedCopy.member_id}`);
})

export default router;