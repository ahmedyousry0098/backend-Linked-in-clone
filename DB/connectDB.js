import mongoose from 'mongoose'

export const connectDB = async () => {
    await mongoose.connect(process.env.DB_LINK)
        .then(() => console.log(`DB Connected Successfully`))
        .catch(err => console.log(`${err}`))
}