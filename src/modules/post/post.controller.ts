import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { postService } from "./post.service"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status";

const createPost = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id

    const payload = req.body

    const posts = await postService.createPostIntoDB(payload, id as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Post Created Successfully',
        data: { posts }
    })
})

const getAllPost = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const posts = await postService.getAllPostFromDB()

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Post Retrived Successfully',
        data: { posts }
    })
})

const getPostById = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    
})

const updatePost = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    
})

const deletePost = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    
})


const getPostStats = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    
})

const getMyStats = catchAsync(async(req: Request, res: Response, next: NextFunction) => {

})

export const postController ={
    createPost, getAllPost, getPostById, getPostStats,
    updatePost, deletePost, getMyStats
}