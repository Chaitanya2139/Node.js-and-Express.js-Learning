const mongoose=require('mongoose');

const issueBookSchema={
    bookId:{
        type:String,
        required:true
    },
    bookName:{
        type:String,
        required:true
    },
    studentId:{
        type:String,
        required:true
    },
    studentName:{
        type:String,
        required:true
    },
    issueDate:{
        type:Date,
        default:Date.now
    },
    returnDate:{
        type:Date,
        default:Date.now
    },
    status:{
        type:String,
        enum:["Issued","Returned"],
        default:"Issued"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
};

const IssueBook=new mongoose.model("IssueBook",issueBookSchema);

module.exports=IssueBook;