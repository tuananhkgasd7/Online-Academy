const db = require('../utils/db');

module.exports = {
    async add(user){
        const [rows, fields] = await db.add(user,'user');
        return rows;
    },

    async singleByUserName(username){
        const sql = `select *, 0 as IsAdmin, 0 as IsTeacher from user where userName = '${username}'`;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0)
            return null;
        return rows[0];
    },
    
    async update(entity){
        const condition =  {
           userID: entity.userID
        };
        delete (entity.userID);
        const [rows, fields] = await db.update(entity, condition,'user');
        return rows;
    },

    async getList(permission){
        const sql = `select *
        from user 
        where permission = ${permission}`;
        const [rows, fields] = await db.load(sql);
        return rows;
    }
};