const supabase = require('../config/db');

class Employee {
    static async findAll(){
        const { data , error } = await supabase.from('employees').select('*');
        if(error){
            throw new Error("Something went wrong");
        } 
        return data;
    }

    static async findById(id){
        const {data,error}= await supabase.from('employees').select('*').eq('id',id).single();
         if(error){
            throw new Error("Could not find employee");
        }
        return data;
    }

    static async create(employee){
        const {data,error}= await supabase.from('employees').insert(employee).select('*').single();
        if(error){
            throw new Error("Could not create employee");
        }
        return data;
    }

    static async findByIdAndUpdate(id,employee){
        const {data,error}= await supabase.from('employees').update(employee).eq('id',id).select('*').single();
        if(error){
            throw new Error("Could not update employee");
        }
        return data;
    }

    static async findByIdAndDelete(id){
        const {data,error}= await supabase.from('employees').delete().eq('id',id).select('*').single();
        if(error){
            throw new Error("Could not delete employee");
        }
        return data;
    }
}

module.exports = Employee;