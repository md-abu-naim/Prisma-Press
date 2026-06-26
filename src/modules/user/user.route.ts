import { NextFunction, Request, Response, Router } from "express"
import { userController } from "./user.controller"
import { jwtUtils } from "../../utils/jwt"
import config from "../../config"
import { Role } from "../../../generated/prisma/enums"
import httpStatus from "http-status";


declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                name: string,
                email: string,
                role: Role
            }
        }
    }
}

const router = Router()

router.post('/register', userController.registerUser)

router.get('/me', (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies

    const verifyToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret)

    if (typeof verifyToken === 'string') {
        throw new Error(verifyToken)
    }

    const { email, name, id, role } = verifyToken

    const requiredRoles = [Role.USER, Role.AUTHOR, Role.ADMIN]

    if (!requiredRoles.includes(role)) {
        res.status(httpStatus.FORBIDDEN).json({
            success: false,
            statusCode: httpStatus.FORBIDDEN,
            message: 'Forbidden. You dont have permission to access this recource'
        })
    }

    req.user = {
        id, email, name, role
    }

    next()
}, userController.getMyProfile)

export const userRouter = router