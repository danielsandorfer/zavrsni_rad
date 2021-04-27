const Sequelize = require('sequelize');
const db = require('./database');
const Op = Sequelize.Op;
const { QueryTypes } = require('sequelize');

const Address = db.define('adresa',{

    sifadresa: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    adresa: {
        type: Sequelize.STRING
    },
    postanskibroj: {
        type: Sequelize.STRING,

    }
},{
    tableName : 'adresa',
    timestamps : false
});

const findAddressById = (id) => {
    return Address.findAll({
        raw: true,
        where: {
            sifadresa: id
        }
    });
}

const findAllAddresses = () => {
    return Address.findAll({
        raw: true,
        order: [
            ['adresa', 'ASC']
        ]
    });
}
const deleteAddress = (eventAddress) => {
    const LocationModel = require("./LocationModel").LocationModel;
    return LocationModel.destroy({
        where: {
            sifadresa: eventAddress.id
        }
    }).
    then(() => {
        return Address.destroy({
            where: {
                sifadresa: eventAddress.id
            }
        });
    })
    
}
const findOrCreateAddress = (eventAddress) => {
    const LocationModel = require("./LocationModel").LocationModel;
    const createLocation = {
        sifadresa: "",
        geosirina: eventAddress.geoWidth,
        geoduzina: eventAddress.geoLength
    }
    return Address.findOrCreate({
        where: {       
            adresa: eventAddress.eventAddress,
            postanskibroj: eventAddress.eventPostalCode
        },
        defaults: { 
            adresa: eventAddress.eventAddress,
            postanskibroj: eventAddress.eventPostalCode
        }
        }).then(([rezultat, created]) => {    
            const rez = rezultat.get({plain: true});
            createLocation.sifadresa = rez.sifadresa;
        }).then(() => {
            console.log(createLocation);
            return LocationModel.findOrCreate({
                where: {
                    sifadresa: createLocation.sifadresa,
                    geosirina: createLocation.geosirina,
                    geoduzina: createLocation.geoduzina
                },
                defaults: {
                    sifadresa: createLocation.sifadresa,
                    geosirina: createLocation.geosirina,
                    geoduzina: createLocation.geoduzina
                }
            });
    })
}
const updateAddress = (oldEventAddress, newEventAddress) => {
    const createAddress = {
        sifadresa: oldEventAddress.id,
        adresa: oldEventAddress.eventAddress,
        postanskibroj: oldEventAddress.eventPostalCode
    }
    if(newEventAddress.eventAddress){
        createAddress.adresa = newEventAddress.eventAddress;
    }
    if(newEventAddress.eventPostalCode){
        createAddress.postanskibroj = newEventAddress.eventPostalCode;
    }

    return Address.update({
        adresa: createAddress.adresa,
        postanskibroj: createAddress.postanskibroj
    },
    {
    where: {
        sifadresa: createAddress.sifadresa
    }
    });
}


const searchAddresses = (event) => {
    const name = "%" + event.eventAddress + "%";
    return Address.findAll({
        raw: true,
        order: [
            ['adresa', 'ASC']
        ],
        where: {
            adresa: {[Sequelize.Op.iLike]: name}
          }
    });

}

module.exports = {
    Address,
    findAllAddresses,
    deleteAddress,
    findOrCreateAddress,
    updateAddress,
    findAddressById,
    searchAddresses
}
