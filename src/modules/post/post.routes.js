import { Router } from 'express'
import { createPost, deletePost, getPosts, likePost, unlikePost, updatePost } from './post.controller.js'
import commentRouter from '../comment/comment.routes.js'
import { uploadFile, validation } from '../../utils/uploadFile.js'
import { isAuthenticated } from '../../middlewares/isAuth.js'
import { isValid } from '../../middlewares/validation.js'
import { createPostSchema, updatePostSchema, postIdSchema } from './post.validation.js'
import { asyncHandler } from '../../utils/ErrorHandling.js'

const router = Router()

router.use('/:postId/comment', commentRouter)

router.post(
    '/create', 
    isAuthenticated, 
    uploadFile({validationSchema: validation.image}).single('image'), 
    isValid(createPostSchema), 
    asyncHandler(createPost)
)
router.put(
    '/:postId/update', 
    isAuthenticated, 
    uploadFile({validationSchema: validation.image}).single('image'), 
    isValid(updatePostSchema), 
    asyncHandler(updatePost)
)
router.get('/', isAuthenticated, asyncHandler(getPosts))
router.patch('/:postId/like', isValid(postIdSchema), isAuthenticated, asyncHandler(likePost))
router.patch('/:postId/unlike', isValid(postIdSchema), isAuthenticated, asyncHandler(unlikePost))
router.patch('/:postId/delete', isValid(postIdSchema), isAuthenticated, asyncHandler(deletePost))

export default router