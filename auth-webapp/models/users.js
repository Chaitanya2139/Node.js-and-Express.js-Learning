const supabase = require('../config/db');


class User {
    static async FindByUsername(username) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error) {
            return null;
    }
    return data;
    }
    static async FindByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
    
        if (error) {
            return null;
        }
        return data;
    } ;
} ;

module.exports = User;
















module.exports = User;