import mongoose from "mongoose";

const connectDb = async()=>{
    try{
        const connect = await mongoose.connect(`${process.env.MONGODB_URI}`,{
            dbName: 'TalkTrek',
        })
        
        console.log('mongodb is connected');
        
    }catch(err){
        console.log(err);
        process.exit(1)
        
    } 
}
export default connectDb