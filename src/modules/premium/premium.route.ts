import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { premiumController } from "./premium.controller";
import { premiumGuard } from "../../middleware/PremiumGuard";

const router = Router()

router.get('/', auth(Role.ADMIN, Role.AUTHOR, Role.USER), premiumGuard(), premiumController.getPremiumContent)

export const premiumRouter = router