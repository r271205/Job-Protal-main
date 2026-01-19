import mongoose from "mongoose";

//Function to connect to the MongoDb database

const connectDb = async () => {

    mongoose.connection.on('connected',() => {
        console.log('DataBase is Connected')
})
    await mongoose.connect(`${process.env.MONGODB_URL}/job-protal`);
}

export default connectDb;