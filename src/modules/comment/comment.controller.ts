import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";


const createComment = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id
    const payload = req.body

    const comment = await commentService.createCommentIntoDB(authorId as string, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Comment Created  successfully',
        data: { comment }
    })
})

const getCommentByAuthorId = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id

    const comments = await commentService.getCommentByAuthorIdFromDB(authorId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Comments Retrive successfully',
        data: { comments }
    })
})

const getCommentByCommentId = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId

    const comment = await commentService.getCommentByCommentIdFromDB(commentId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Comment Retrive successfully',
        data: { comment }
    })
})

const updateComment = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId
    const payload = req.body
    const authorId = req.user?.id

    const comment = await commentService.updateCommentInDB(commentId as string, payload, authorId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Comment Update successfully',
        data: { comment }
    })
})

const deleteComment = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId
    const authorId = req.user?.id

    console.log(authorId, 'from delete');

    const comment = await commentService.deleteCommentIntoDB(commentId as string, authorId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Comment Deleted successfully',
        data: { comment }
    })
})

const moderateComment = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId
    const payload = req.body

    console.log(commentId,'commentid', payload);

    const comment = await commentService.moderateCommentFromDB(commentId as string, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Comment Updated successfully',
        data: { comment }
    })
})


export const commentController = {
    createComment, getCommentByAuthorId, getCommentByCommentId,
    updateComment, deleteComment, moderateComment
}