const mongoose = require("mongoose"); 
require('dotenv').config();
const config = require("config");
const dbgr = require("debug")("development:mongoose");

const dbURI = process.env.MONGODB_URI;


const connectDb = async () => {
    
    await mongoose.connect(`${dbURI}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000
        
    }).then(function(){
        dbgr("connected");
    })
    .catch(function(err){
        dbgr(err);
    })
    
}

connectDb();


module.exports = mongoose.connection;