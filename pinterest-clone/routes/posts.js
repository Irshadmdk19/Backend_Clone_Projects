const mongoose = require("mongoose")

const postSchema= new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title: String,
    description: String,
    image: String,
    createdAt:{
        type: Date,
        default: Date.now,
    },
})

module.exports= mongoose.model('Post', postSchema)