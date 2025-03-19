import mongoose from "mongoose";

export const database = ()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        dbName:"Hospital" 

    }).then(()=>{
            console.log("database is connected")
    }) .catch((err)=>{
        console.log("No dataBase is not connected :",err)
    })
} 

export default database;