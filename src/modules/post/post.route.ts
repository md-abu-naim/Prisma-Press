import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post('/', auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.createPost)

router.get('/', postController.getAllPost)

router.get('/stats', auth(Role.ADMIN), postController.getPostStats)

router.get('/my-posts', auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.getMyPosts)

router.get('/:postId', postController.getPostById)

router.patch('/:postId', auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.updatePost)

router.delete('/:postId', auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.deletePost)

export const postRouter = router