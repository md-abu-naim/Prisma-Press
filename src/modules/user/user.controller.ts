import { NextFunction, Request, RequestHandler, response, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import jwt  from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

// const registerUser = async (req: Request, res: Response) => {
//     try {
//         const payload = req.body

//         const user = await userService.registerUserIntoDB(payload)

//         res.status(httpStatus.CREATED).json({
//             success: true,
//             statusCode: httpStatus.CREATED,
//             message: 'User registered successfully',
//             data: { user }
//         })

//     } catch (error) {
//         console.log(error);

//         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//             success: false,
//             statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//             message: 'Field to register user',
//             error: (error as Error).message
//         })
//     }
// }

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body

    const user = await userService.registerUserIntoDB(payload)

    // res.status(httpStatus.CREATED).json({
    //     success: true,
    //     statusCode: httpStatus.CREATED,
    //     message: 'User registered successfully',
    //     data: { user }
    // })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'User registered successfully',
        data: { user }
    })
})

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {accessToken} = req.cookies
    
    const verifyToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret)

    if(typeof verifyToken === 'string'){
        throw new Error(verifyToken)
    }

    const profile = await userService.getMyProfileFromDB(verifyToken.id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'User profile fatched successfully',
        data: { profile }
    })
})

export const userController = {
    registerUser, getMyProfile
}