const mongoose = require('mongoose');
const MONGO_URI =  process.env.MONGO_URI


// Some Problem in local Environment Variables
// if(!MONGO_URI){
//     throw new Error ('Monog_URI Environment Variable is not Defined');
// }

const connectDB = async () => {
    try{
        await mongoose.connect("mongodb+srv://karanKumar:Zvno5Ik0LPg5HVW1@cluster0.uyfvl1x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (error){
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;