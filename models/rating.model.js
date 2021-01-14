const db = require('../utils/db');

module.exports = {
    async add(comment){
        const [rows, fields] = await db.add(comment,'rating');
        return rows;
    },

    async getNumRating(idCourse){
        const sql = `select count(rate) as numRating
        from rating
        where courseID = '${idCourse}'`;
        const [rows, fields] = await db.load(sql);
        return rows[0].numRating;
    },

    async getRating(idCourse){
        const sql = `select AVG(rate) as rating
        from rating
        where courseID = '${idCourse}'`;
        const [rows, fields] = await db.load(sql);
        var rating = rows[0].rating;
        rating = parseFloat(rating).toFixed(1);
        return rating;
    },

    async getNumRating_Star(star, idCourse){
        const sql = `select count(rate) as rating
        from rating
        where courseID = '${idCourse}' and rate = ${star}`;
        const [rows, fields] = await db.load(sql);
        return rows[0].rating;
    },

    async getUserComment(idCourse){
        const sql = `select r.*, u.fullName
        from rating r left join user u on r.userID = u.userID
        where courseID = '${idCourse}'`;
        const [rows, fields] = await db.load(sql);
        return rows;
    }
};