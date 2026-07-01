import { prisma } from "../../lib/prisma"
import { ICreateComment, IModerateComment, IUpdateComment } from "./comment.interface"


const createCommentIntoDB = async(authorId: string, payload: ICreateComment) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    })

    const comment = await prisma.comment.create({
        data: {
            ...payload,
            authorId
        }
    })

    return comment
}

const getCommentByAuthorIdFromDB = async(authorId: string) => {
    const comments = await prisma.comment.findMany({
        where: {
            id: authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })

    return comments
}

const getCommentByCommentIdFromDB = async(commentId: string) => {
    const comment = await prisma.comment.findMany({
        where: {
            id: commentId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true
                }
            }
        }
    })

    return comment
}

const updateCommentInDB = async(commentId: string, data: IUpdateComment, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })

    if(!commentData){
        throw new Error("Your Provided Input is invalid")
    }

    const comment = await prisma.comment.update({
        where: {
            id: commentId,
            authorId
        },
        data
    })

    return comment
}

const deleteCommentIntoDB = async(commentId: string, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })

    if(!commentData){
        throw new Error("Your Provided Input is invalid")
    }

    await prisma.comment.delete({
        where:{
            id: commentId,
            authorId
        }
    })

    return null
}

const moderateCommentFromDB = async(id: string, data: IModerateComment) => {
    const commentData = await prisma.comment.findUniqueOrThrow({
        where: {
            id
        },
        select: {
            id: true,
            status: true
        }
    })

    if(commentData.status === data.status){
        throw new Error(`Your provided status (${data.status}) is already up to date`)
    }

    const commment = await prisma.comment.update({
        where: {
            id
        },
        data
    })

    return commment
}

export const commentService = {
    createCommentIntoDB, getCommentByAuthorIdFromDB, getCommentByCommentIdFromDB,
    updateCommentInDB, deleteCommentIntoDB, moderateCommentFromDB
}