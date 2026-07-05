import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { prisma } from "../lib/prisma";

export const premiumGuard = () => {
    return catchAsync(async(req: Request, res: Response, next: NextFunction ) => {
    const userId = req.user?.id

    const subscription = await prisma.subscription.findUnique({
        where: {
            userId
        }
    })

    if(!subscription){
        throw new Error('Please subscribed for premium content')
    }

    if(subscription?.status !== subscription?.status){
        throw new Error('Please subscribed again')
    }

    next()
})
}