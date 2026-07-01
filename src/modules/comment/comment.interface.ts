import { CommentStatus } from "../../../generated/prisma/enums"

export interface ICreateComment {
    postId: string,
    authorId: string
    content: string
}

export interface IUpdateComment {
    content?: string,
    status?: CommentStatus
}

export interface IModerateComment{
    status: CommentStatus
}