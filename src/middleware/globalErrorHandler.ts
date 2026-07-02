import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                statusCode: httpStatus.INTERNAL_SERVER_ERROR,
                errorCode: err.code || null,
                name: err.name,
                message: err.message,
                error: err.stack
            })
}