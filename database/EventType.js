const Sequelize= require('sequelize');
const Image = require("./Image").Image;
const Comment = require("./Comment").Comment;
const Score = require("./Score").Score;
const Op = Sequelize.Op;
const db= require('./database');

const EventType=db.define('tip_dogadaja',{
    siftipdogadaj: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nazivtipdogadaj: {
        type: Sequelize.STRING
    }
},{
    tableName : 'tip_dogadaja',
    timestamps : false
});

const findEventTypeById = (PK) => {
    return EventType.findByPk(PK, {plain: true});
}
const findAllEventTypes = () => {
    return EventType.findAll({
        raw: true,
        order: [
            ['nazivtipdogadaj', 'ASC']
        ]
    });
}
const findOrCreateEventType = (newEventType) => {
    return EventType.findOrCreate({
        where: {
        nazivtipdogadaj: newEventType.eventTypeName
        },
        defaults:{
         nazivtipdogadaj: newEventType.eventTypeName
        }
      });
}
const deleteEventType = (eventType) => {
    
    return Event.destroy({
        where: {
            siftipdogadaj: eventType.id
        }
    }).then(() => {
        return EventType.destroy({
            where: {
                siftipdogadaj: eventType.id
            }
        })
    });
}

const updateEventType = (eventType) => {
    return EventType.update({
        nazivtipdogadaj: eventType.eventTypeName
    }, 
    {
        where: {
            siftipdogadaj: eventType.id
        }
    });
}

const searchEventTypes = (event) => {
    const name = "%" + event.eventTypeName + "%";
    return EventType.findAll({
        raw: true, 
        where: {
          nazivtipdogadaj: {[Sequelize.Op.iLike]: name}
        }, order: [
            ['nazivtipdogadaj', 'ASC']
        ]
    });
}


module.exports = {
    EventType,
    findOrCreateEventType,
    findEventTypeById,
    findAllEventTypes,
    deleteEventType,
    updateEventType,
    searchEventTypes
}