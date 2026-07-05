import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { postService } from "./post.service"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status";

const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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

const getAllPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    
    const result = await postService.getAllPostFromDB(query)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Post Retrived Successfully',
        data: result.data,
        meta: result.meta
    })
})

const getPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId

    if (!postId) {
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

const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id
    const postId = req.params.postId
    const payload = req.body
    const isAdmin = req.user?.role === 'ADMIN'

    const result = await postService.updatePostIntoDB(postId as string, payload, authorId as string, isAdmin)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Post Updated Successfully',
        data: { result }
    })
})

const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id
    const postId = req.params.postId
    const isAdmin = req.user?.role === 'ADMIN'

    await postService.deletePostIntoDB(postId as string, authorId as string, isAdmin)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Post Deleted Successfully',
        data: null
    })
})


const getPostStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getPostStatsFromDB()
    console.log(result);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Post Stats Retrived Successfully',
        data: result
    })
})

const getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id

    const posts = await postService.getMyPostsFromDB(authorId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'My Post Retrived Successfully',
        data: { posts }
    })
})

export const postController = {
    createPost, getAllPost, getPostById, getPostStats,
    updatePost, deletePost, getMyPosts
}