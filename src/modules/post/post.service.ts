import { CommentStatus, PostStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface"

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
        // filtering / exact match without AND oparetor
        // where: {
        //     title: "This is my fourth title ",
        //     content: "This is fourth content"
        // }

        // filtering / exact match with AND oparetor
        // where: {
        //     AND: [
        //         {
        //             title: "This is my fourth title "
        //         },
        //         {
        //             content: "This is fourth content"
        //         }
        //     ]
        // },

        // Searching / partial match without OR oparetor
        // where: {
        //     title: {
        //         contains: 'title',
        //         mode: 'insensitive'
        //     },
        //     content: {
        //         contains: 'content',
        //         mode: 'insensitive'
        //     }
        // },

        // Searching / partial match without OR oparetor 
        // where: {
        //     OR: [
        //         {
        //             title: {
        //                 contains: 'content',
        //                 mode: 'insensitive'
        //             }
        //         },
        //         {
        //             content: {
        //                 contains: 'content',
        //                 mode: 'insensitive'
        //             }
        //         }
        //     ]
        // },

        // Filtering & searching combing
        where: {
            AND: [
                {
                    // searching
                    OR: [
                        {
                            title: {
                                contains: "title",
                                mode: 'insensitive'
                            },
                            content: {
                                contains: 'content',
                                mode: 'insensitive'
                            }
                        }
                    ]
                },
                {
                    title: 'This is my fourth title '
                },
                {
                    content: 'This is fourth content'
                }
            ]
        },
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return posts
}

const getPostByIdFromDB = async (postId: string) => {
    // await prisma.post.update({
    //     where: {
    //         id: postId
    //     },
    //     data: {
    //         views: {
    //             increment: 1
    //         }
    //     },
    // })

    // const post = await prisma.post.findUniqueOrThrow({
    //     where: {
    //         id: postId
    //     },
    //     include: {
    //         author: {
    //             omit: {
    //                 password: true
    //             }
    //         },
    //         comments: {
    //             where: {
    //                 status: CommentStatus.APPROVED
    //             },
    //             orderBy: {
    //                 createdAt: "desc"
    //             }
    //         },
    //         _count: {
    //             select: {
    //                 comments: true
    //             }
    //         }
    //     }
    // })

    const tracnsactionResult = await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: postId
            },
            data: {
                views: {
                    increment: 1
                }
            }
        })

        const post = await tx.post.findUniqueOrThrow({
            where: {
                id: postId
            },
            include: {
                author: {
                    omit: {
                        password: true
                    }
                },
                comments: {
                    where: {
                        status: CommentStatus.APPROVED
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                },
                _count: {
                    select: {
                        comments: true
                    }
                }
            }
        })

        return post
    })

    return tracnsactionResult
}

const updatePostIntoDB = async (postId: string, payload: IUpdatePostPayload, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    })

    if (!isAdmin && post.authorId === authorId) {
        throw new Error("You are not the owner of this post!")
    }

    const result = await prisma.post.update({
        where: {
            id: postId
        },
        data: payload,
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    })

    return result
}

const deletePostIntoDB = async (postId: string, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    })

    if (!isAdmin && post.authorId === authorId) {
        throw new Error("You are not the owner of this post!")
    }

    const result = await prisma.post.delete({
        where: {
            id: postId
        }
    })

    return null
}

const getPostStatsFromDB = async () => {
    const tracnsactionResult = await prisma.$transaction(async (tx) => {
        // const totalPosts = await tx.post.count()

        // const totalPublishedPosts = await tx.post.count({
        //     where: {
        //         status: PostStatus.PUBLISHED
        //     }
        // })

        // const totalDraftPosts = await tx.post.count({
        //     where: {
        //         status: PostStatus.DRAFT
        //     }
        // })

        // const totalArchivedPosts = await tx.post.count({
        //     where: {
        //         status: PostStatus.ARCHIVED
        //     }
        // })

        // const totalComments = await tx.comment.count()

        // const totalApprovedComments = await tx.comment.count({
        //     where: {
        //         status: CommentStatus.APPROVED
        //     }
        // })

        // const totalRejectComments = await tx.comment.count({
        //     where: {
        //         status: CommentStatus.REJECT
        //     }
        // })

        // // const allPosts = await tx.post.findMany()

        // // let totalPostsViews = 0

        // // allPosts.forEach((post) => {
        // //     totalPostsViews = totalPostsViews + post.views
        // // })

        // const totalPostsViewsAggregation = await tx.post.aggregate({
        //     _sum: {
        //         views: true
        //     }
        // })

        // const totalPostsViews = totalPostsViewsAggregation._sum.views

        // return {
        // totalPosts, totalPublishedPosts, totalArchivedPosts, totalDraftPosts,
        // totalComments, totalApprovedComments, totalRejectComments, totalPostsViews
        // }

        const [
            totalPosts, totalPublishedPosts, totalArchivedPosts, totalDraftPosts,
            totalComments, totalApprovedComments, totalRejectComments, totalPostsViewsAggregation
        ] = await Promise.all([
            await tx.post.count(),

            await tx.post.count({
                where: {
                    status: PostStatus.PUBLISHED
                }
            }),

            await tx.post.count({
                where: {
                    status: PostStatus.DRAFT
                }
            }),

            await tx.post.count({
                where: {
                    status: PostStatus.ARCHIVED
                }
            }),

            await tx.comment.count(),

            await tx.comment.count({
                where: {
                    status: CommentStatus.APPROVED
                }
            }),

            await tx.comment.count({
                where: {
                    status: CommentStatus.REJECT
                }
            }),

            await tx.post.aggregate({
                _sum: {
                    views: true
                }
            })
        ])

        return {
            totalPosts, totalPublishedPosts, totalArchivedPosts, totalDraftPosts,
            totalComments, totalApprovedComments, totalRejectComments,
            totalPostsViews: totalPostsViewsAggregation._sum.views
        }
    })

    return tracnsactionResult
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