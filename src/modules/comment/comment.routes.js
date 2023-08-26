import {Router} from 'express'
import { isValid } from '../../middlewares/validation.js'
import { isAuthenticated } from '../../middlewares/isAuth.js'
import { asyncHandler } from '../../utils/ErrorHandling.js'
import { commentIdSchema, createCommentSchema, deleteCommentSchema, updateCommentSchema } from './comment.validation.js'
import { addComment, deleteComment, likeComment, unlikeComment, updateComment } from './comment.controller.js'

const router = Router({mergeParams: true})

// Comment
router.post('/', isValid(createCommentSchema), isAuthenticated, asyncHandler(addComment))
router.patch('/:commentId/like', isValid(commentIdSchema), isAuthenticated, asyncHandler(likeComment))
router.patch('/:commentId/unlike', isValid(commentIdSchema), isAuthenticated, asyncHandler(unlikeComment))
router.put('/:commentId/update', isValid(updateCommentSchema), isAuthenticated, asyncHandler(updateComment))
router.patch('/:commentId/delete', isValid(deleteCommentSchema), isAuthenticated, asyncHandler(deleteComment))

export default router;