import { prisma } from "../../lib/prisma"
import { ICreatePostPayload } from "./post.interface"

const createPostIntoDB = async (payload: ICreatePostPayload, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        }
    })
    return result
}

const getAllPostFromDB = async () => {
    const posts = await prisma.post.findMany({
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    })

    return posts
}

const getPostByIdFromDB = async () => {

}

const updatePostIntoDB = async () => {

}

const deletePostIntoDB = async () => {

}

const getPostStatsFromDB = async () => {

}

const getMyStatsFromDB = async () => {

}

export const postService = {
    createPostIntoDB, getAllPostFromDB, getPostByIdFromDB,
    updatePostIntoDB, deletePostIntoDB, getPostStatsFromDB,
    getMyStatsFromDB
}