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
    const postId = req.params.postId

    if(!postId){
        throw new Error('Post Id Requred in Params')
    }

    const post = await postService.getPostByIdFromDB(postId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Post Retrived Successfully',
        data: { post }
    })
})

const updatePost = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    
})

const deletePost = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    
})


const getPostStats = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    
})

const getMyPosts = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id

    const posts = await postService.getMyPostsFromDB(authorId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'My Post Retrived Successfully',
        data: { posts }
    })
})

export const postController ={
    createPost, getAllPost, getPostById, getPostStats,
    updatePost, deletePost, getMyPosts
}