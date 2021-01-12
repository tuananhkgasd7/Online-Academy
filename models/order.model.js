const db = require('../utils/db');

module.exports = {
    async add(order){
        const [rows, fields] = await db.add(order,'orders');
        if(rows.length===0)
            return null;
        return rows;
    },
};