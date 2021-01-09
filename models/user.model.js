const db = require('../utils/db');

module.exports = {
    async add(user){
        const [rows, fields] = await db.add(user,'user');
        return rows;
    },

    async singleByUserName(username){
        const sql = `select * from user where userName = '${username}'`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0)
            return null;
        return rows[0];
    }
};