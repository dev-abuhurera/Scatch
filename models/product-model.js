const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    image: String,
    name: String,
    price: Number,

    discount:{
        type:Number,
        default:0
    },

    bgcolor:{
        type:String,
        
    },
    
    panelcolor:{
        type:String,
    
    },

    textcolor:{
        type:String,
       
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner"
    },
    
});

module.exports = mongoose.model("product", productSchema);