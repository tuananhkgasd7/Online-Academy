const db = require('../utils/db');
const { paginate } = require('./../config/default.json');

module.exports = {
    async all() {
        const sql = 'select c.*, t.teacherName, ca.catName from (course c join teacher t on c.teacherID = t.teacherID) join category ca on c.catID = ca.catID';
        const [rows, fields] = await db.load(sql);
        return rows;
    },

    async allByCat(idCat) {
        const sql = `select c.*, t.teacherName, ca.catName from (course c join teacher t on c.teacherID = t.teacherID) join category ca on c.catID = ca.catID where c.catID= ${idCat}`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },

    async pageByCat(idCat, offset) {
        const sql = `select c.*, t.teacherName, ca.catName from (course c join teacher t on c.teacherID = t.teacherID) join category ca on c.catID = ca.catID where c.catID= ${idCat} limit ${paginate.limit} offset ${offset}`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },

    async countByCat(idCat) {
        const sql = `select count(*) as total from course where catID=${idCat}`;
        const [rows, fields] = await db.load(sql);
        return rows[0].total;
    },

    async single(idCourse) {
        const sql = `select * from course where courseID = '${idCourse}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;

        return rows[0];
    },

    async update(entity){
        const condition =  {
           courseID: entity.courseID
        };
        console.log(condition)
        console.log(entity)
        delete (entity.courseID);
        const [rows, fields] = await db.update(entity, condition,'course');
        console.log(rows)
        return rows;
    },

    async getTeacher(idCourse) {
        const sql = `select t.* from course c join teacher t on c.teacherID = t.teacherID where courseID = '${idCourse}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        console.log(rows);
        return rows[0];
    },
    
    async search(search, offset){
        const sql = `select c.*, t.teacherName,
        sum(match(c.courseName) against('${search}' IN BOOLEAN MODE) +
        match(t.teacherName) against('${search}' IN BOOLEAN MODE)) as relevance
    from course c left join teacher t on c.teacherID = t.teacherID 
    where
        match(c.courseName) against('${search}' IN BOOLEAN MODE) or
        match(t.teacherName) against('${search}' IN BOOLEAN MODE)
    group by
        c.courseID
    order by
    relevance DESC
    limit ${paginate.limit} offset ${offset}`;
        const [rows,fields] = await db.load(sql);
        return rows;
    },

    async countBySearch(search) {
        const sql = `select count(c.courseID) as total,
        sum(match(c.courseName) against('${search}' IN BOOLEAN MODE) +
        match(t.teacherName) against('${search}' IN BOOLEAN MODE)) as relevance
    from course c left join teacher t on c.teacherID = t.teacherID 
    where
        match(c.courseName) against('${search}' IN BOOLEAN MODE) or
        match(t.teacherName) against('${search}' IN BOOLEAN MODE)`;
        const [rows, fields] = await db.load(sql);
        return rows[0].total;
    },

    async mostJoinedCourse() {
        const sql = `select c.*, t.teacherName, ca.catName
        from (course c left join teacher t on c.teacherID = t.teacherID) left join category ca on c.catID = ca.catID
        ORDER BY c.numStudent DESC 
        LIMIT 5`;
        const [rows, fields] = await db.load(sql);
        return rows;
      },

    async latestCourse() {
        const sql = `select c.*, t.teacherName, ca.catName
        from (course c left join teacher t on c.teacherID = t.teacherID) left join category ca on c.catID = ca.catID
        ORDER BY c.updateDate DESC 
        LIMIT 10`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },

    async topCourse() {
        const sql = `select c.*, t.teacherName, ca.catName
        from (course c left join teacher t on c.teacherID = t.teacherID) left join category ca on c.catID = ca.catID
        where DATEDIFF(CURDATE(), DATE(c.updateDate)) <= 15
        ORDER BY c.rating DESC,
                c.numRating DESC,
                c.numStudent DESC
        LIMIT 4`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },

    async mostBuyCourse(idCat) {
        const sql = `select c.*, t.teacherName, ca.catName
        from (course c left join teacher t on c.teacherID = t.teacherID) left join category ca on c.catID = ca.catID
        where c.catID = ${idCat}
        ORDER BY c.numStudent DESC 
        LIMIT 5`;
        const [rows, fields] = await db.load(sql);
        return rows;
    }
};