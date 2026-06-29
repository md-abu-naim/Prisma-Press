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

const getPostByIdFromDB = async (postId: string) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })

    const updatedPost = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            views: {
                increment: 1
            }
        },
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    })

    return updatedPost
}

const updatePostIntoDB = async () => {

}

const deletePostIntoDB = async () => {

}

const getPostStatsFromDB = async () => {

}

const getMyPostsFromDB = async (authorId: string) => {
    const posts = await prisma.post.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true,
            _count: {
                select: {
                    comments: true
                }
            }
        }
    })

    return posts
}

export const postService = {
    createPostIntoDB, getAllPostFromDB, getPostByIdFromDB,
    updatePostIntoDB, deletePostIntoDB, getPostStatsFromDB,
    getMyPostsFromDB
}