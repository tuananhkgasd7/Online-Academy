const db = require('../utils/db');

module.exports = {
    async add(detail){
        const [rows, fields] = await db.add(detail,'orderdetail');
        if(rows.length===0)
            return null;
        return rows;
    },
};