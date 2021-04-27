const Sequelize = require('sequelize');
const db = require('./database');
const Country = require("./Country").Country;
const Op = Sequelize.Op;
const { QueryTypes } = require('sequelize');

const Place = db.define('mjesto2',{
    sifmjesto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    postanskibroj: {
        type: Sequelize.STRING
    },
    nazivmjesto: {
        type: Sequelize.STRING
    },
    sifdrzava: {
        type: Sequelize.INTEGER
    }
},{
    tableName : 'mjesto2',
    timestamps : false
});

Place.belongsTo(Country, {as: 'drzava', foreignKey: 'sifdrzava'});

const findPlaceById = (id) => {
    return Place.findAll({
        where: {
            sifmjesto: id
        },
        include: {
            model: Country,
            as: 'drzava'
        },
        raw: true
    });
}
const findAllPlaces = () => {
    return Place.findAll({
        raw: true,
        include: {
            model: Country,
            as: 'drzava'
        },
        order: [
            ['nazivmjesto', 'ASC']
        ]
    });
}
const deletePlace = (eventPlace) => {
    return Place.destroy({
        where: {
            sifmjesto: eventPlace.id
        }
    });
}
const findOrCreatePlace = (eventPlace) => {
    const newPlace = {
        postanskibroj: eventPlace.postalCode,
        nazivmjesto: eventPlace.place,
        sifdrzava: ""
    }
    return Country.findOrCreate({
        where: {       
            nazivdrzava: eventPlace.country,
        }
    }).then(([rezultat, created]) => {
        const rez = rezultat.get({plain: true});
        newPlace.sifdrzava = rez.sifdrzava;
    }).then(() => {
        return Place.findOrCreate({
            where: {
                postanskibroj: newPlace.postanskibroj,
                nazivmjesto: newPlace.nazivmjesto,
                sifdrzava: newPlace.sifdrzava 
            },
            defaults: {
                postanskibroj: newPlace.postanskibroj,
                nazivmjesto: newPlace.nazivmjesto,
                sifdrzava: newPlace.sifdrzava 
            }
        })
    });
   
}
const updatePlace = (oldEventPlace, newEventPlace) => {
    const createPlace = {
        sifmjesto: oldEventPlace.id,
        postanskibroj: oldEventPlace.eventPostalCode,
        nazivmjesto: oldEventPlace.eventPlace,
        nazivdrzava: oldEventPlace.eventCountry,
        sifdrzava: ""
    }
    if(newEventPlace.eventPlace){
        createPlace.nazivmjesto = newEventPlace.eventPlace;
    }
    if(newEventPlace.eventPostalCode){
        createPlace.postanskibroj = newEventPlace.eventPostalCode;
    }
    if(newEventPlace.eventCountry) {
        createPlace.nazivdrzava = newEventPlace.eventCountry;
    }

        return Country.findOrCreate({
        where: {
            nazivdrzava: createPlace.nazivdrzava,
        },
        defaults: { 
            nazivdrzava: createPlace.nazivdrzava,
        }
        }).then(([rezultat, created]) => {
            const rez = rezultat.get({plain: true});
            createPlace.sifdrzava = rez.sifdrzava;
        }).then(() => {
            console.log("UPDATE S PODACIMA " + JSON.stringify(createPlace));
            return Place.update(
                {
                    postanskibroj: createPlace.postanskibroj,
                    nazivmjesto: createPlace.nazivmjesto,
                    sifdrzava: createPlace.sifdrzava
                },
                {
                    where: {
                        sifmjesto: createPlace.sifmjesto
                    }
                }
            )
        });
}

const searchPlaces = (event) => {
    const name = "%" + event.eventPlace + "%";
    return Place.findAll({
        raw: true,
        include: {
            model: Country,
            as: 'drzava'
        },
        order: [
            ['nazivmjesto', 'ASC']
        ],
        where: {
            nazivmjesto: {[Sequelize.Op.iLike]: name}
          }
    });
    
}

module.exports = {
    Place,
    findAllPlaces,
    deletePlace,
    findOrCreatePlace,
    updatePlace,
    findPlaceById,
    searchPlaces
}
