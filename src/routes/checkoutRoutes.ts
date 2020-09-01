import express from "express";
import {CheckoutRequest} from "../models/requestModels";
import {checkinCopy, checkoutCopy} from "../database/checkouts";
import {fetchMemberByEmail} from "../database/members";

const router = express.Router();

router.post('/new', async (request, response) => {
    const checkout = request.body as CheckoutRequest;
    const insertedCheckout = await checkoutCopy(checkout.memberId!, checkout.copyId);
    response.json(insertedCheckout);
});

router.post('/new-by-email', async (request, response) => {
    const checkout = request.body as CheckoutRequest;
    const member = await fetchMemberByEmail(checkout.email!);
    if (!member) {
        throw Error(`no user found matching email: ${checkout.email}`)
    }
    const checkoutId = await checkoutCopy(member.id, checkout.copyId);
    response.json({id: checkoutId});
});

router.post('/:checkoutId/checkin', async (request, response) => {
    const checkoutId = parseInt(request.params.checkoutId);
    const updatedCopy = await checkinCopy(checkoutId);
    response.json(updatedCopy);
});

export default router;