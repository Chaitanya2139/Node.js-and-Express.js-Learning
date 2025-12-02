const express=require('express');
const {getAllBooks,getBookById,createBook,uppdateBook,deleteBook}=require('../controllers/bookController');  

const router=express.Router();

router.get('/',getAllBooks);
router.get('/:id',getBookById);
router.post('/',createBook);
router.put('/:id',uppdateBook);
router.delete('/:id',deleteBook);

module.exports=router;