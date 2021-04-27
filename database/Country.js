const Sequelize = require('sequelize');
const db = require('./database');
const Op = Sequelize.Op;
const { QueryTypes } = require('sequelize');

const Country = db.define('drzava',{

    sifdrzava: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nazivdrzava: {
        type: Sequelize.STRING
    }
},{
    tableName : 'drzava',
    timestamps : false
});

const findCountryById = (id) => {
    return Country.findAll({
        where: {
            sifdrzava: id
        },
        raw: true
    });
}

const findAllCountries = () => {
    return Country.findAll({
        raw: true,
        order: [
            ['nazivdrzava', 'ASC']
        ]
    });
}
const deleteCountry = (eventCountry) => {
    return Country.destroy({
        where: {
            sifdrzava: eventCountry.id
        }
    })
}
const findOrCreateCountry = (eventCountry) => {
    return Country.findOrCreate({
        where: {       
            nazivdrzava: eventCountry.country,
        }
    })
}
const updateCountry = (oldEventCountry, newEventCountry) => {
    const createCountry = {
        sifdrzava: oldEventCountry.id,
        nazivdrzava: oldEventCountry.eventCountry,
    }
    if(newEventCountry.eventCountry){
        createCountry.nazivdrzava = newEventCountry.eventCountry;
    }

    return Country.update({
        nazivdrzava: createCountry.nazivdrzava,
    },
    {
    where: {
        sifdrzava: createCountry.sifdrzava
    }
    });
}


const searchCountries = (event) => {
    const name = "%" + event.eventCountry + "%";
    return Country.findAll({
        raw: true, 
        where: {
          nazivdrzava: {[Sequelize.Op.iLike]: name}
        },
        order: [
            ['nazivdrzava', 'ASC']
        ]
    });
}

module.exports = {
    Country,
    findAllCountries,
    deleteCountry,
    findOrCreateCountry,
    updateCountry,
    findCountryById,
    searchCountries
}
