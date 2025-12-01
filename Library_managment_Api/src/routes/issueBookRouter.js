const express=require('express');
const {issueBook,returnBook}=require('../controllers/issueBookController');

const router=express.Router();

router.post('/',issueBook);
router.put('/:id',returnBook);

module.exports=router;