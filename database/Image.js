const Sequelize = require('sequelize');
const db = require('./database');
const UserModel = require("./User");

const Image=db.define('slika2',{
    sifdogadaj: {
        type: Sequelize.INTEGER,
        primaryKey: true,

    },
    korisnickoime: {
        type: Sequelize.STRING,
        primaryKey: true
    },
   sifslika: {
    type: Sequelize.STRING,
    primaryKey: true,
    autoIncrement: true,
   },
    putanjaslika: {
        type: Sequelize.STRING
    }
},{
    tableName : 'slika2',
    timestamps : false
});



const getAllImagesByEventId = (id) => {
    return Image.findAll({
        where: {
            sifdogadaj: id
        }
    });
}

const getOneImageByEventId = (id) => {
    return Image.findAll({
        where: {
            sifdogadaj: id
        },
        limit: 1
    });
}
const findOrCreateImage = (image) => {

    return Image.findOrCreate({
        where: {
            putanjaslika: image.eventImagePath,
            sifdogadaj: image.eventId
        },
        defaults: {
            sifdogadaj: image.eventId,
            korisnickoime: image.username,
            putanjaslika: image.eventImagePath
        } 
    });
}

const getAllImages = () => {

    return db.query(`SELECT "slika2"."sifdogadaj", "slika2"."korisnickoime", "slika2"."sifslika", "slika2"."putanjaslika", "dogadaj2"."sifdogadaj" AS "dogadaj2.sifdogadaj", "dogadaj2"."sifmjesto" AS "dogadaj2.sifmjesto", "dogadaj2"."siftipdogadaj" AS "dogadaj2.siftipdogadaj", "dogadaj2"."korisnickoime" AS "dogadaj2.korisnickoime", "dogadaj2"."opisdogadaj" AS "dogadaj2.opisdogadaj", "dogadaj2"."datpocetak" AS "dogadaj2.datpocetak", "dogadaj2"."datkraj" AS "dogadaj2.datkraj", "dogadaj2"."dogadajvidljiv" AS "dogadaj2.dogadajvidljiv", "dogadaj2"."nazivdogadaj" AS "dogadaj2.nazivdogadaj" FROM "slika2" AS "slika2" LEFT OUTER JOIN "dogadaj2" AS "dogadaj2" ON "slika2"."sifdogadaj" = "dogadaj2"."sifdogadaj" ORDER BY "dogadaj2"."nazivdogadaj" ASC;`, { type: db.QueryTypes.SELECT})
    .then(function(images) {
        return images;
    })
}

const getAllImagesByUser = (username) => {
 
    return db.query(`SELECT "slika2"."sifdogadaj", "slika2"."korisnickoime", "slika2"."sifslika", "slika2"."putanjaslika", "dogadaj2"."sifdogadaj" AS "dogadaj2.sifdogadaj", "dogadaj2"."sifmjesto" AS "dogadaj2.sifmjesto", "dogadaj2"."siftipdogadaj" AS "dogadaj2.siftipdogadaj", "dogadaj2"."korisnickoime" AS "dogadaj2.korisnickoime", "dogadaj2"."opisdogadaj" AS "dogadaj2.opisdogadaj", "dogadaj2"."datpocetak" AS "dogadaj2.datpocetak", "dogadaj2"."datkraj" AS "dogadaj2.datkraj", "dogadaj2"."dogadajvidljiv" AS "dogadaj2.dogadajvidljiv", "dogadaj2"."nazivdogadaj" AS "dogadaj2.nazivdogadaj" FROM "slika2" AS "slika2" LEFT OUTER JOIN "dogadaj2" AS "dogadaj2" ON "slika2"."sifdogadaj" = "dogadaj2"."sifdogadaj" WHERE "slika2"."korisnickoime" = '${username}' ORDER BY "dogadaj2"."nazivdogadaj" ASC;`, { type: db.QueryTypes.SELECT})
    .then(function(images) {
        return images;
    })
}

const deleteImage = (id) => {
    return Image.destroy({
        where: {
            sifslika: id
        }
    });
}

const searchImages = (event) =>{
   return UserModel.isOwner(event.username).then(result => {
        const isAdmin = result;
        if(isAdmin) {
            return db.query(`SELECT "slika2"."sifdogadaj", "slika2"."korisnickoime", "slika2"."sifslika", "slika2"."putanjaslika", "dogadaj2"."sifdogadaj" AS "dogadaj2.sifdogadaj", "dogadaj2"."sifmjesto" AS "dogadaj2.sifmjesto", "dogadaj2"."siftipdogadaj" AS "dogadaj2.siftipdogadaj", "dogadaj2"."korisnickoime" AS "dogadaj2.korisnickoime", "dogadaj2"."opisdogadaj" AS "dogadaj2.opisdogadaj", "dogadaj2"."datpocetak" AS "dogadaj2.datpocetak", "dogadaj2"."datkraj" AS "dogadaj2.datkraj", "dogadaj2"."dogadajvidljiv" AS "dogadaj2.dogadajvidljiv", "dogadaj2"."nazivdogadaj" AS "dogadaj2.nazivdogadaj" FROM "slika2" AS "slika2" LEFT OUTER JOIN "dogadaj2" AS "dogadaj2" ON "slika2"."sifdogadaj" = "dogadaj2"."sifdogadaj" WHERE "dogadaj2"."nazivdogadaj" ILIKE '%${event.eventName}%' ORDER BY "dogadaj2"."nazivdogadaj" ASC;`, { type: db.QueryTypes.SELECT})
            .then(function(images) {
                return images;
            })
        } else {
            return db.query(`SELECT "slika2"."sifdogadaj", "slika2"."korisnickoime", "slika2"."sifslika", "slika2"."putanjaslika", "dogadaj2"."sifdogadaj" AS "dogadaj2.sifdogadaj", "dogadaj2"."sifmjesto" AS "dogadaj2.sifmjesto", "dogadaj2"."siftipdogadaj" AS "dogadaj2.siftipdogadaj", "dogadaj2"."korisnickoime" AS "dogadaj2.korisnickoime", "dogadaj2"."opisdogadaj" AS "dogadaj2.opisdogadaj", "dogadaj2"."datpocetak" AS "dogadaj2.datpocetak", "dogadaj2"."datkraj" AS "dogadaj2.datkraj", "dogadaj2"."dogadajvidljiv" AS "dogadaj2.dogadajvidljiv", "dogadaj2"."nazivdogadaj" AS "dogadaj2.nazivdogadaj" FROM "slika2" AS "slika2" LEFT OUTER JOIN "dogadaj2" AS "dogadaj2" ON "slika2"."sifdogadaj" = "dogadaj2"."sifdogadaj" WHERE "dogadaj2"."nazivdogadaj" ILIKE '%${event.eventName}%' AND "dogadaj2"."korisnickoime" = '${event.username}' ORDER BY "dogadaj2"."nazivdogadaj" ASC;`, { type: db.QueryTypes.SELECT})
            .then(function(images) {
                return images;
            })
        }
    })
   
}
module.exports = {
    Image,
    getAllImagesByEventId,
    findOrCreateImage,
    getOneImageByEventId,
    getAllImagesByUser,
    deleteImage,
    getAllImages,
    searchImages
}