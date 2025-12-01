const mongoose=require('mongoose');

const bookSchema={
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    publishedYear:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:["Available","Not Available"],
        default:"Available"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
};

const Book= new mongoose.model("Book",bookSchema);
module.exports=Book;