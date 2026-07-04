import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionService } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'

const createCheckout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id

    const result = await subscriptionService.createCheckoutSessionIntoDB(userId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Checkout Completed Successfully',
        data: result
    })
})

const handleWebhook = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const event = req.body as Buffer
    const signature = req.headers['stripe-signature']! as string

     await subscriptionService.handleWebhookFromStripe(event, signature)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Webhook Triggerd Successfully',
        data: null
    })
})

export const subscriptionController = {
    createCheckout, handleWebhook
}