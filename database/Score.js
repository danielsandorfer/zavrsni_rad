const Sequelize = require('sequelize');
const db = require('./database');

const Score=db.define('ocjena2',{
    sifdogadaj: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    korisnickoime: {
        type: Sequelize.STRING,
        primaryKey: true
    },
   sifocjena: {
    type: Sequelize.STRING,
    autoIncrement: true,
    primaryKey: true
   },
   ocjena: {
       type: Sequelize.INTEGER
   },
   datumvrijemeocjene: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    } 
},{
    tableName : 'ocjena2',
    timestamps : false
});

const getAllScoresByEventId = (id) => {
    return Score.findAll({
        where: {
            sifdogadaj: id
        }
    });
}

const getAverageScoreForEvent = (id) => {

    return Score.findAll({
        attributes: [[Sequelize.fn('AVG', Sequelize.col('ocjena')), 'totalgrade']],
        group : ['sifdogadaj'],
        where: {
            sifdogadaj: id
        },
        raw: true,
        order: Sequelize.literal('totalgrade DESC')
     });
}

const findOrCreateScore = (score) => {
   return Score.findOne({
        where: {
            sifdogadaj: score.eventId,
            korisnickoime: score.username,
        },
        raw: true
    }).then(res => {
        if(res) {
            return Score.update(
                {
                    ocjena: score.grade  
                },
                {
                    where: {
                        sifdogadaj: score.eventId,
                        korisnickoime: score.username
                    }
                }
            )
        } else {
            return Score.create({
                sifdogadaj: score.eventId,
                korisnickoime: score.username,
                ocjena: score.grade
        });
        }
    })
   
}

const findUserScoreForEvent = (score) => {

    return Score.findAll({
        group: ['sifdogadaj', 'korisnickoime', 'sifocjena'],
        where: {
            sifdogadaj: score.eventId,
            korisnickoime: score.username
        },
        raw: true,
        order: Sequelize.literal('datumvrijemeocjene DESC'),
        limit: 1
    });
}

module.exports = {
    Score,
    getAllScoresByEventId,
    findOrCreateScore,
    findUserScoreForEvent,
    getAverageScoreForEvent
}