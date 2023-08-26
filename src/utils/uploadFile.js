import multer from 'multer'

export const validation = Object.freeze({
    image: ['image/jpg', 'image/png', 'image/jpeg'],
})

export const uploadFile = ({validationSchema=[]}) => {

    const storage = multer.diskStorage({})
    function fileFilter (req, file, cb) {
        if (validationSchema.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('In-valid Format'), false)
        }
    }

    return multer({fileFilter, storage})
}
