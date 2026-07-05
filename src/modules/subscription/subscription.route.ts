import { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post('/checkout', auth(Role.ADMIN, Role.AUTHOR, Role.USER), subscriptionController.createCheckout)

router.post("/webhook", subscriptionController.handleWebhook)

router.get('/stats',auth(Role.ADMIN, Role.AUTHOR, Role.USER), subscriptionController.getSubscriptionStats)


export const subscriptionRouter = router