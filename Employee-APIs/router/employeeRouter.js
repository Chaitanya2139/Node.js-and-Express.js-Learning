const express = require('express');
const Employee = require('../models/Employee');

const router = express.Router();

router.get('/',async (req,res)=>{
    const allEmployees = await Employee.findAll();
    return res.status(200).json(allEmployees);
});

router.get('/:id',async (req,res)=>{
    try{
        const employee = await Employee.findById(req.params.id);
        if(!employee){
            res.status(404).send("Employee Not Found!");
        }else{
            res.status(200).json(employee);
        }
    }catch(error){
        res.status(500).json({message:error.message});
    }
});

router.post('/',async (req,res)=>{
    try{
        const createdEmployee = await Employee.create(req.body);
        if(!createdEmployee){
            res.status(404).json({message:"Error Creating Employee"})
        }else{
            res.status(200).json(createdEmployee);
        }
    }catch(error){
        res.status(500).json({message:error.message});
    }
});

router.put('/',async (req,res)=>{
    try{
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id,req.body);
        if(!updatedEmployee){
            res.status(404).json({message:'Employee Not Found'});
        }else{
            res.status(200).json(updatedEmployee);
        }
    }catch(error){
        res.status(500).json({message:error.message});
    }
});

router.delete('/',async (req,res)=>{
    try{
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if(!deletedEmployee){
            res.status(404).json({message:"Employee Not Found"});
        }else{
            res.status(200).json(deletedEmployee);
        }
    }catch(error){
        res.status(500).json({message:error.message})
    }
});

module.exports=router;