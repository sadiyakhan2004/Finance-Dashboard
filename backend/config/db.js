import mongoose from "mongoose";

const connectToDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB Successfully");
    }
    catch(error){
        console.error(error);
        process.exit(1);
    }
}

export default connectToDB;