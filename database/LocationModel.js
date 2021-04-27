const Sequelize= require('sequelize');
const db= require('./database');
const Address = require("./Address").Address;
const Place = require("./Place").Place;
const Country = require("./Country").Country;

const LocationModel = db.define('lokacija',{
    siflokacija: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sifadresa: {
        type: Sequelize.INTEGER
    },
    geosirina: {
        type: Sequelize.FLOAT
    },
    geoduzina: {
        type: Sequelize.FLOAT
    }
},{
    tableName : 'lokacija',
    timestamps : false
});


LocationModel.belongsTo(Address, {as: 'adresa', foreignKey: 'sifadresa'});



const findAllLocations = () => {
    return LocationModel.findAll({
        raw: true,
        include: 
            {
                model: Address,
                as: 'adresa',
                include: {
                    model: Place,
                    as: 'mjesto2',
                    include: {
                        model: Country,
                        as: 'drzava'
                    }
               }
            }
                
    });
}

const deleteLocation = (addressId) => {

    return LocationModel.destroy({
        where: {
            sifadresa: addressId
        }
    });
}





module.exports = {
    LocationModel,
    findAllLocations,
    deleteLocation,
}