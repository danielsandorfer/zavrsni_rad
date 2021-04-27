const Sequelize = require('sequelize');
const db = require('./database');

const Comment=db.define('komentar2',{
    sifdogadaj: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    korisnickoime: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    datumvrijemeobjava: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    tekstkomentar: {
        type: Sequelize.STRING
    }
},{
    tableName : 'komentar2',
    timestamps : false
});

const getAllCommentsByEventId = (id) => {
    return Comment.findAll({
        where: {
            sifdogadaj: id
        },
        order: [
            ['datumvrijemeobjava', 'DESC']
        ]
    });
}

const findOrCreateComment = (comment) => {
    return Comment.create({
            sifdogadaj: comment.eventId,
            korisnickoime: comment.username,
            tekstkomentar: comment.commentText
    });
}
const deleteComment = (comment) => {
     return Comment.destroy({
        where: {
            sifdogadaj: comment.eventId,
            korisnickoime: comment.username,
            datumvrijemeobjava: comment.dateTime
        }
    })
}

const getAllComments = () => {
    return db.query(`SELECT "komentar2"."sifdogadaj", "komentar2"."korisnickoime", "komentar2"."datumvrijemeobjava", "komentar2"."tekstkomentar", "dogadaj2"."sifdogadaj" AS "dogadaj2.sifdogadaj", "dogadaj2"."sifmjesto" AS "dogadaj2.sifmjesto", "dogadaj2"."siftipdogadaj" AS "dogadaj2.siftipdogadaj", "dogadaj2"."korisnickoime" AS "dogadaj2.korisnickoime", "dogadaj2"."opisdogadaj" AS "dogadaj2.opisdogadaj", "dogadaj2"."datpocetak" AS "dogadaj2.datpocetak", "dogadaj2"."datkraj" AS "dogadaj2.datkraj", "dogadaj2"."dogadajvidljiv" AS "dogadaj2.dogadajvidljiv", "dogadaj2"."nazivdogadaj" AS "dogadaj2.nazivdogadaj" FROM "komentar2" AS "komentar2" LEFT OUTER JOIN "dogadaj2" AS "dogadaj2" ON "komentar2"."sifdogadaj" = "dogadaj2"."sifdogadaj" ORDER BY "dogadaj2"."nazivdogadaj" ASC;`, { type: db.QueryTypes.SELECT})
    .then(function(comments) {
        return comments;
    })
}
const getAllCommentsByUser = (username) => {
    return Comment.findAll({
        where: {
            korisnickoime: username
        },
        raw: true,
        order: [
            ['sifdogadaj', 'ASC']
        ]
    })
}

const searchComments = (event) => {
    const name = "%" + event.eventCommentName + "%";
    return db.query(`SELECT "komentar2"."sifdogadaj", "komentar2"."korisnickoime", "komentar2"."datumvrijemeobjava", "komentar2"."tekstkomentar", "dogadaj2"."sifdogadaj" AS "dogadaj2.sifdogadaj", "dogadaj2"."sifmjesto" AS "dogadaj2.sifmjesto", "dogadaj2"."siftipdogadaj" AS "dogadaj2.siftipdogadaj", "dogadaj2"."korisnickoime" AS "dogadaj2.korisnickoime", "dogadaj2"."opisdogadaj" AS "dogadaj2.opisdogadaj", "dogadaj2"."datpocetak" AS "dogadaj2.datpocetak", "dogadaj2"."datkraj" AS "dogadaj2.datkraj", "dogadaj2"."dogadajvidljiv" AS "dogadaj2.dogadajvidljiv", "dogadaj2"."nazivdogadaj" AS "dogadaj2.nazivdogadaj" FROM "komentar2" AS "komentar2" LEFT OUTER JOIN "dogadaj2" AS "dogadaj2" ON "komentar2"."sifdogadaj" = "dogadaj2"."sifdogadaj" WHERE "dogadaj2"."nazivdogadaj" ILIKE '%${name}%' ORDER BY "dogadaj2"."nazivdogadaj" ASC;`, { type: db.QueryTypes.SELECT})
    .then(function(comments) {
        return comments;
    })
}

module.exports = {
    Comment,
    findOrCreateComment,
    getAllCommentsByEventId,
    deleteComment,
    getAllComments,
    getAllCommentsByUser,
    searchComments
}