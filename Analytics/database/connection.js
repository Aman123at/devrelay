import mongoose from 'mongoose';
export const connectWithDb = async()=>{
    try {
        const connection =  await mongoose.connect(process.env.DB_URL)
        console.log("DB GOT CONNECTED")
        return connection
    } catch (error) {
        console.log("DB CONNECTION ISSUES")
        console.log(error)
        process.exit(1)
        return null
    }
}
