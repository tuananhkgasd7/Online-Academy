const db = require('../utils/db');

module.exports = {
    async all() {
        const sql = 'select * from category';
        const [rows, fields] = await db.load(sql);
        return rows;
    },

    async allWithDetail() {
        const sql = "select ca.*, count(c.courseID) as courseCount, 0 as IsActive\
        from category ca left join course c on ca.catID = c.catID\
        group by ca.catID, ca.catName";
        const [rows, fields] = await db.load(sql);
        return rows;
    },

    async add(category){
        const [rows, fields] = await db.add(category,'category');
        if(rows.length===0)
            return null;
        return rows;
    },

    async single(id){
        const sql = 'select * from category where catID =' + id;
        const [rows,fields] = await db.load(sql);
        if(rows.length===0)
            return null;
        return rows[0];
    },

    async del(id){
        const condition =  {
           catID: id
        };
        const [rows, fields] = await db.del(condition,'category');
        return rows;
    },

    async update(entity){
        const condition =  {
           catID: entity.catID
        };
        delete (entity.catID);
        const [rows, fields] = await db.update(entity, condition,'category');
        return rows;
    }
};