const db = require('../utils/db');
const { paginate } = require('./../config/default.json');

module.exports = {
    async all() {
        const sql = 'select * from course';
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

    async getTeacher(idCourse) {
        const sql = `select t.* from course c join teacher t on c.teacherID = t.teacherID where courseID = '${idCourse}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        console.log(rows);
        return rows[0];
    }
};