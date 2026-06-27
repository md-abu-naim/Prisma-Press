import { NextFunction, Request, Response } from "express"
import { Role } from "../../generated/prisma/enums"
import { catchAsync } from "../utils/catchAsync"
import { jwtUtils } from "../utils/jwt"
import config from "../config"
import { JwtPayload } from "jsonwebtoken"
import httpStatus from "http-status";
import { prisma } from "../lib/prisma"


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


export const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ? req.cookies.accessToken
            : req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization?.split(" ")[1]
                : req.headers.authorization

        if (!token) {
            throw new Error('You are not logged in. Please login to access this recource')
        }

        const verifyToken = jwtUtils.verifyToken(token, config.jwt_access_secret)

        if (!verifyToken.success) {
            throw new Error(verifyToken.error)
        }

        const { email, name, id, role } = verifyToken.data as JwtPayload

        if (requiredRoles?.length && !requiredRoles.includes(role)) {
            res.status(httpStatus.FORBIDDEN).json({
                success: false,
                statusCode: httpStatus.FORBIDDEN,
                message: 'Forbidden. You dont have permission to access this recource'
            })
        }

        const user = await prisma.user.findUnique({
            where: {
                id, email, name, role
            }
        })

        if (!user) {
            throw new Error("User not found. Pleas login again")
        }

        if (user.activeStatus === "BLOCEKD") {
            throw new Error('Your account has been blocked. Pleas contact support')
        }

        req.user = {
            id, email, name, role
        }

        next()
    })
}