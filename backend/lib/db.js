import mongoose from 'mongoose';

export default async (DB_URL) => {
    try{
        await mongoose.connect(DB_URL);
        console.log("connected to db");
    } catch(err) {
        console.log(err);
    }
}