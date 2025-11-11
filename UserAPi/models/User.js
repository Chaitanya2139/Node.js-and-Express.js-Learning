const supabase = require('../config/db');

class User {
    static async findByUsername(username) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();
        if (error) return null;

        return data;
    }

    static async findByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (error) return null;
        return data;
    }

    static async create(newUser) {
        const { data, error } = await supabase
            .from('users')
            .insert([newUser])
            .select()
            .single();
        if (error) throw error;
        return data;
    }
}

module.exports = User;