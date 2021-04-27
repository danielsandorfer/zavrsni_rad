const Sequelize = require('sequelize');
const db = require('./database');
const EventType = require("./EventType").EventType;
const User = require("./User").User;
const UserModel = require("./User");
const Image = require("./Image").Image;
const Comment = require("./Comment").Comment;
const Score = require("./Score").Score;
const LocationModel = require("./LocationModel").LocationModel;
const Place = require("./Place").Place;
const Country = require("./Country").Country;
const Address = require("./Address").Address;
const Op = Sequelize.Op;

const EventModel = db.define('dogadaj2',{
    sifdogadaj: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    siflokacija: {
        type: Sequelize.INTEGER,
    },
    sifmjesto: {
        type: Sequelize.INTEGER,
    },
    siftipdogadaj: {
        type: Sequelize.INTEGER,
    },
    korisnickoime: {
        type: Sequelize.STRING
    },
    opisdogadaj: {
        type: Sequelize.TEXT
    },
    datpocetak: {
        type: Sequelize.DATE
    },
    datkraj: {
        type: Sequelize.DATE
    },
    dogadajvidljiv: {
        type: Sequelize.BOOLEAN
    },
    nazivdogadaj: {
        type: Sequelize.STRING
    }
},{
    tableName : 'dogadaj2',
    timestamps : false
});

EventModel.belongsTo(User, {as: 'korisnik', foreignKey: 'korisnickoime'});
EventModel.belongsTo(LocationModel, {as: 'lokacija', foreignKey: 'siflokacija'});
EventModel.belongsTo(Place, {as: 'mjesto2', foreignKey: 'sifmjesto'});
EventModel.belongsTo(EventType, {as: 'tip_dogadaja', foreignKey: 'siftipdogadaj'});
EventModel.hasMany(Comment, {as: 'komentar2', foreignKey: 'sifdogadaj'});
EventModel.hasMany(Image, {as: 'slika2', foreignKey: 'sifdogadaj'});
EventModel.hasMany(Score, {as: 'ocjena2', foreignKey: 'sifdogadaj'});
Comment.belongsTo(EventModel, {as: 'dogadaj2', foreignKey: 'sifdogadaj'});
Image.belongsTo(EventModel, {as: 'dogadaj2', foreignKey: 'sifdogadaj'});

const findEventById = (PK) => {
    return EventModel.findAll({
        include: [
            {
                model: EventType,
                as: 'tip_dogadaja'
            },
             {
                model: LocationModel,
                as: 'lokacija',
                include: {
                    model: Address,
                    as: 'adresa'
                }
            },
            {
                model: Place,
                as: 'mjesto2',
                include: {
                    model: Country,
                    as: 'drzava'
                }
            },
            {
                model: User,
                as: 'korisnik'
            }
        ], 
        raw: true, 
        where: {
         sifdogadaj: PK }});
}

const findAllEvents = () => {
    return EventModel.findAll({
        include: [
            {
                model: EventType,
                as: 'tip_dogadaja'
            },
             {
                model: LocationModel,
                as: 'lokacija',
                include: {
                    model: Address,
                    as: 'adresa'
                }
            },
            {
                model: Place,
                as: 'mjesto2',
                include: {
                    model: Country,
                    as: 'drzava'
                }
            },
            {
                model: User,
                as: 'korisnik'
            }
        ], 
        raw: true, 
        where: {
            dogadajvidljiv: true 
        },
        order: [
            ['nazivdogadaj', 'ASC']
        ]
    });
}

const findEventsByTypeId = (id) => {
    return EventModel.findAll({
        include: [
            {
                model: LocationModel,
                as: 'lokacija',
                include: {
                    model: Address,
                    as: 'adresa'
                }
            },
            {
                model: Place,
                as: 'mjesto2',
                include: {
                    model: Country,
                    as: 'drzava'
                }
            },
            {
                model: Image,
                as: 'slika2'
            }
        ], 
        raw: true, 
        where: {
         siftipdogadaj: id,
        dogadajvidljiv: true
        },
        order: [
            ['datpocetak' , 'DESC']
        ]
    }); 
  
    }

const findEventsByUser = (username) => {
    return EventModel.findAll({
        include: [
            {
                model: EventType,
                as: 'tip_dogadaja'
            },
             {
                model: LocationModel,
                as: 'lokacija',
                include: {
                    model: Address,
                    as: 'adresa'
                }
            },
            {
                model: Place,
                as: 'mjesto2',
                include: {
                    model: Country,
                    as: 'drzava'
                }
            },
            {
                model: User,
                as: 'korisnik'
            }
        ], 
        raw: true, 
        where: {
            dogadajvidljiv: true,
            korisnickoime: username
        },
        order: [
            ['nazivdogadaj', 'ASC']
        ]
    });

}
const findOrCreateEvent = (event) => {

    const noviEvent = {
        sifmjesto: "",
        siftipdogadaj: "",
        korisnickoime: event.username,
        opisdogadaj: event.eventDescription,
        datpocetak: (event.startDate.split(".")[2] + "-" + event.startDate.split(".")[1] + "-" + event.startDate.split(".")[0]),
        datkraj: (event.endDate.split(".")[2] + "-" + event.endDate.split(".")[1] + "-" + event.endDate.split(".")[0]),
        dogadajvidljiv: true,
        nazivdogadaj: event.eventName,
        sifdrzava: "",
        nazivdrzava: event.country,
        sifadresa: "",
        siflokacija: ""
    }

    
        return Country.findOrCreate({
        where: {nazivdrzava: event.country},
        defaults: { 
                    nazivdrzava: event.country,
                    }
        }).then(([rezultat, created]) => {
            const rez = rezultat.get({plain: true});
            noviEvent.sifdrzava = rez.sifdrzava;
        }).then(() => {
            return Place.findOrCreate({
                 where: {
                     postanskibroj: event.postalCode,
                     nazivmjesto: event.place,
                     sifdrzava: noviEvent.sifdrzava
                    },
                 defaults: { 
                    postanskibroj: event.postalCode,
                    nazivmjesto: event.place,
                    sifdrzava: noviEvent.sifdrzava
                }
             }).then(([rezultat, created]) => {
                 const rez = rezultat.get({plain: true});
                 noviEvent.sifmjesto = rez.sifmjesto;
             })
         }).then(() => {
            return Address.findOrCreate({
                 where: {
                     adresa: event.address,
                     postanskibroj: event.postalCode
                    },
                 defaults: { 
                    adresa: event.address,
                    postanskibroj: event.postalCode
                }
             }).then(([rezultat, created]) => {
                 const rez = rezultat.get({plain: true});
                 noviEvent.sifadresa = rez.sifadresa;
             })
         }).then(() => {
            return LocationModel.findOrCreate({
                 where: {
                     sifadresa: noviEvent.sifadresa,
                     geosirina: event.geoWidth,
                     geoduzina: event.geoLength
                    },
                 defaults: { 
                    sifadresa: noviEvent.adresa,
                    geosirina: event.geoWidth,
                    geoduzina: event.geoLength
                }
             }).then(([rezultat, created]) => {
                 const rez = rezultat.get({plain: true});
                 noviEvent.siflokacija = rez.siflokacija;
             })
         }).then(() => {
            return EventType.findOrCreate({
                 where: {nazivtipdogadaj: event.eventType},
                 defaults: {nazivtipdogadaj: event.eventType}
             }).then(([rezultat, created]) => {
                 const rez = rezultat.get({plain: true});
                 noviEvent.siftipdogadaj = rez.siftipdogadaj;
             })
         }).then(() => {
            if(event.imagePath) {
                const newEvent = {
                    sifmjesto: noviEvent.sifmjesto,
                    siflokacija: noviEvent.siflokacija,
                    siftipdogadaj: noviEvent.siftipdogadaj,
                    korisnickoime: event.username,
                    opisdogadaj: event.eventDescription,
                    datpocetak: (event.startDate.split(".")[2] + "-" + event.startDate.split(".")[1] + "-" + event.startDate.split(".")[0]),
                    datkraj: (event.endDate.split(".")[2] + "-" + event.endDate.split(".")[1] + "-" + event.endDate.split(".")[0]),
                    dogadajvidljiv: true,
                    nazivdogadaj: event.eventName,
                    slika2: {
                        korisnickoime: event.username,
                        putanjaslika: event.imagePath
                    }
                }
                return EventModel.create(newEvent, {
                    include: ['slika2']
                });
            } else {
                 return EventModel.create(noviEvent)
                
            }
         });
}
const updateEvent = (oldEvent, event) => {

    const createEvent = {
        sifdogadaj: oldEvent.id,
        sifmjesto: oldEvent.placeId,
        siflokacija: oldEvent.locationId,
        siftipdogadaj: oldEvent.eventTypeId,
        korisnickoime: oldEvent.username,
        opisdogadaj: oldEvent.eventDescription,
        datpocetak: (oldEvent.startDate.split(".")[2] + "-" + oldEvent.startDate.split(".")[1] + "-" + oldEvent.startDate.split(".")[0]),
        datkraj: (oldEvent.endDate.split(".")[2] + "-" + oldEvent.endDate.split(".")[1] + "-" + oldEvent.endDate.split(".")[0]),
        dogadajvidljiv: true,
        nazivdogadaj: oldEvent.eventName,
    }
    const createLocation = {
        sifadresa: oldEvent.addressId,
        sifdrzava: oldEvent.countryId,
        nazivdrzava: oldEvent.eventCountry,
        nazivmjesto: oldEvent.eventPlace,
        adresa: oldEvent.eventAddress,
        postanskibroj: oldEvent.eventPostalCode,
        geosirina: oldEvent.eventGeoWidth,
        geoduzina: oldEvent.eventGeoLength
    }
    const createEventType = {
        nazivtipdogadaj: oldEvent.eventType
    }
  
    // azuriraj mjesto ako je potrebno
    if(event.eventCountry) {
        createLocation.nazivdrzava = event.eventCountry;
    }
    if(event.eventPlace) {
        createLocation.nazivmjesto = event.eventPlace;
    }
    if(event.eventAddress) {
        createLocation.adresa = event.eventAddress;
        createLocation.geosirina = event.eventGeoWidth;
        createLocation.geoduzina = event.eventGeoLength;
    }
    if(event.eventPostalCode) {
        createLocation.postanskibroj = event.eventPostalCode;
    }
    // azuriraj tip dogadaja ako je potrebno
    if(event.eventType){
        createEventType.nazivtipdogadaj = event.eventType;
    }
    // azuriraj dogadaj ako je potrebno
    if(event.eventDescription) {
        createEvent.opisdogadaj = event.eventDescription;
    }
    if(event.startDate) {
        var sDate = event.startDate.split(".");
        createEvent.datpocetak = (sDate[2] + "-" + sDate[1] + "-" + sDate[0]);
    }
    if(event.endDate) {
        var eDate = event.endDate.split(".");
        createEvent.datkraj = (eDate[2] + "-" + eDate[1] + "-" + eDate[0]);
    }
    if(event.eventName) {
        createEvent.nazivdogadaj = event.eventName;
    }
   
    return Country.findOrCreate({
        where: {nazivdrzava: createLocation.nazivdrzava},
        defaults: { 
                    nazivdrzava: createLocation.nazivdrzava
                }
        }).then(([rezultat, created]) => {
            const rez = rezultat.get({plain: true});
            createLocation.sifdrzava = rez.sifdrzava;
        }).then(() => {
            return Place.findOrCreate({
                 where: {
                     postanskibroj: createLocation.postanskibroj,
                     nazivmjesto: createLocation.nazivmjesto,
                     sifdrzava: createLocation.sifdrzava
                    },
                 defaults: { 
                    postanskibroj: createLocation.postanskibroj,
                     nazivmjesto: createLocation.nazivmjesto,
                     sifdrzava: createLocation.sifdrzava
                }
             }).then(([rezultat, created]) => {
                 const rez = rezultat.get({plain: true});
                 createEvent.sifmjesto = rez.sifmjesto;
             })
         }).then(() => {
            return Address.findOrCreate({
                 where: {
                     adresa: createLocation.adresa,
                     postanskibroj: createLocation.postanskibroj
                    },
                 defaults: { 
                    adresa: createLocation.adresa,
                     postanskibroj: createLocation.postanskibroj
                }
             }).then(([rezultat, created]) => {
                 const rez = rezultat.get({plain: true});
                 createLocation.sifadresa = rez.sifadresa;
             })
         }).then(() => {
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
             }).then(([rezultat, created]) => {
                 const rez = rezultat.get({plain: true});
                 createEvent.siflokacija = rez.siflokacija;
             })
         }).then(() => {
            return EventType.findOrCreate({
                where: {nazivtipdogadaj: createEventType.nazivtipdogadaj},
                defaults: {nazivtipdogadaj: createEventType.nazivtipdogadaj}
            }).then(([rezultat, created]) => {
                const rez = rezultat.get({plain: true});
                createEvent.siftipdogadaj = rez.siftipdogadaj;
            });
        }).then(() => {
            return EventModel.update(
                {
                    sifmjesto: createEvent.sifmjesto,
                    siftipdogadaj: createEvent.siftipdogadaj,
                    siflokacija: createEvent.siflokacija,
                    korisnickoime: createEvent.korisnickoime,
                    opisdogadaj: createEvent.opisdogadaj,
                    datpocetak: createEvent.datpocetak,
                    datkraj: createEvent.datkraj,
                    dogadajvidljiv: true,
                    nazivdogadaj: createEvent.nazivdogadaj,   
                },
                {
                    where: {
                        sifdogadaj: createEvent.sifdogadaj
                    }
                }
            );
        });

}


const deleteEvent = (event) => {

    return Image.destroy({
        where: {sifdogadaj: event.id,
                korisnickoime: event.username}
    }).then(() => {
        return Comment.destroy({
            where: {sifdogadaj: event.id}
        })
    }).then(() => {
        return Score.destroy({
            where: {sifdogadaj: event.id}
        })
    }).then(() => {
        return EventModel.destroy({
            where: { sifdogadaj: event.id}
        });
    });
}



const searchEvents = (event) => {
    const name = "%" + event.eventName + "%";
    return UserModel.isOwner(event.username).then(result => {
        const isAdmin = result;
        if(isAdmin) {
            return EventModel.findAll({
                include: [
                    {
                        model: LocationModel,
                        as: 'lokacija',
                        include: {
                            model: Address,
                            as: 'adresa'
                        }
                    },
                    {
                        model: Place,
                        as: 'mjesto2',
                        include: {
                            model: Country,
                            as: 'drzava'
                        }
                    },
                    {
                        model: Image,
                        as: 'slika2'
                    }
                ], 
                raw: true, 
                order: [
                    ['nazivdogadaj' , 'ASC']
                ],
                where: {
                  nazivdogadaj: {[Sequelize.Op.iLike]: name}
                }
            });
        } else {
            return EventModel.findAll({
                include: [
                    {
                        model: LocationModel,
                        as: 'lokacija',
                        include: {
                            model: Address,
                            as: 'adresa'
                        }
                    },
                    {
                        model: Place,
                        as: 'mjesto2',
                        include: {
                            model: Country,
                            as: 'drzava'
                        }
                    },
                    {
                        model: Image,
                        as: 'slika2'
                    }
                ], 
                raw: true, 
                order: [
                    ['nazivdogadaj' , 'ASC']
                ],
                where: {
                  nazivdogadaj: {[Sequelize.Op.iLike]: name},
                  korisnickoime: event.username
                }
            });
        }
    })
    
}

const searchEventsList = (event) => {
    const name = "%" + event.eventName + "%";
    const eventTypeId = event.eventTypeId;
    return EventModel.findAll({
        include: [
            {
                model: LocationModel,
                as: 'lokacija',
                include: {
                    model: Address,
                    as: 'adresa'
                }
            },
            {
                model: Place,
                as: 'mjesto2',
                include: {
                    model: Country,
                    as: 'drzava'
                }
            },
            {
                model: Image,
                as: 'slika2'
            }
        ], 
        raw: true, 
        order: [
            ['datpocetak' , 'DESC']
        ],
        where: {
          nazivdogadaj: {[Sequelize.Op.iLike]: name},
          siftipdogadaj: eventTypeId
        }
    });
}


// pronadi dogadaje nekog tipa filtirane prema vremenskom razdoblju
const findFilteredEvents = (startDate, endDate, eventTypeId) => {
    if(startDate) {
        startDate = startDate.split(".")[2] + "-" + startDate.split(".")[1] + "-" + startDate.split(".")[0];
    }
    if(endDate) {
        endDate = endDate.split(".")[2] + "-" + endDate.split(".")[1] + "-" + endDate.split(".")[0];
    }
    
    if(eventTypeId) {
        if(startDate && endDate) {
            return EventModel.findAll({
                where: {
                    datpocetak: {
                        [Op.gte]: `'${startDate}'` 
                    },
                    datkraj: {
                        [Op.lte]: `'${endDate}'` 
                    },
                    siftipdogadaj: eventTypeId
                },
                include: [
                    {
                        model: Place,
                        as: 'mjesto2',
                        include: {
                            model: Country,
                            as: 'drzava'
                        }
                    },
                    {
                        model: LocationModel,
                        as: 'lokacija',
                        include: {
                            model: Address,
                            as: 'adresa'
                        }
                    },
                    {
                        model: Image,
                        as: 'slika2'
                    }
                ], 
               raw: true,
               order: [
                   ['datpocetak' , 'DESC']
               ]
            });
        } else if(startDate) {
            return EventModel.findAll({
                where: {
                    datpocetak: {
                        [Op.gte]: `'${startDate}'` 
                    },
                    siftipdogadaj: eventTypeId
                },
                include: [
                    {
                        model: Place,
                        as: 'mjesto2',
                        include: {
                            model: Country,
                            as: 'drzava'
                        }
                    },
                    {
                        model: LocationModel,
                        as: 'lokacija',
                        include: {
                            model: Address,
                            as: 'adresa'
                        }
                    },
                    {
                        model: Image,
                        as: 'slika2'
                    }
                ], 
               raw: true,
               order: [
                   ['datpocetak' , 'DESC']
               ] 
            });
        } else if(endDate) {
            return EventModel.findAll({
                where: {
                    datkraj: {
                        [Op.lte]: `'${endDate}'` 
                    },
                    siftipdogadaj: eventTypeId
                },
                include: [
                    {
                        model: Place,
                        as: 'mjesto2',
                        include: {
                            model: Country,
                            as: 'drzava'
                        }
                    },
                    {
                        model: LocationModel,
                        as: 'lokacija',
                        include: {
                            model: Address,
                            as: 'adresa'
                        }
                    },
                    {
                        model: Image,
                        as: 'slika2'
                    },
                ], 
               raw: true,
               order: [
                   ['datpocetak' , 'DESC']
               ] 
            });
        
        } else {
            return EventModel.findAll({
                include: [
                    {
                        model: Place,
                        as: 'mjesto2',
                        include: {
                            model: Country,
                            as: 'drzava'
                        }
                    },
                    {
                        model: LocationModel,
                        as: 'lokacija',
                        include: {
                            model: Address,
                            as: 'adresa'
                        }
                    },
                    {
                        model: Image,
                        as: 'slika2'
                    },
                ], 
                raw: true,
                order: [
                    ['datpocetak' , 'DESC']
                ],
                where: {
                        dogadajvidljiv: true ,
                        siftipdogadaj: eventTypeId
                    }
            });
        }
    } 

   
}

// pronadi sve dogadaje filtrirane prema nekom razdoblju
const findFilteredEventLocations = (startDate, endDate) => {

    if(startDate) {
        startDate = startDate.split(".")[2] + "-" + startDate.split(".")[1] + "-" + startDate.split(".")[0];
    }
    if(endDate) {
        endDate = endDate.split(".")[2] + "-" + endDate.split(".")[1] + "-" + endDate.split(".")[0];
    }

    if(startDate && endDate) {
        return EventModel.findAll({
            where: {
                datpocetak: {
                    [Op.gte]: `'${startDate}'` 
                },
                datkraj: {
                    [Op.lte]: `'${endDate}'` 
                }
            },
            include: [
                {
                    model: EventType,
                    as: 'tip_dogadaja'
                },
                 {
                    model: LocationModel,
                    as: 'lokacija',
                    include: {
                        model: Address,
                        as: 'adresa'
                    }
                },
                {
                    model: Place,
                    as: 'mjesto2',
                    include: {
                        model: Country,
                        as: 'drzava'
                    }
                },
                {
                    model: User,
                    as: 'korisnik'
                }
            ], 
           raw: true 
        });
    } else if(startDate) {
        return EventModel.findAll({
            where: {
                datpocetak: {
                    [Op.gte]: `'${startDate}'` 
                }
            },
            include: [
                {
                    model: EventType,
                    as: 'tip_dogadaja'
                },
                 {
                    model: LocationModel,
                    as: 'lokacija',
                    include: {
                        model: Address,
                        as: 'adresa'
                    }
                },
                {
                    model: Place,
                    as: 'mjesto2',
                    include: {
                        model: Country,
                        as: 'drzava'
                    }
                },
                {
                    model: User,
                    as: 'korisnik'
                }
            ], 
           raw: true 
        });
    } else if(endDate) {
        return EventModel.findAll({
            where: {
                datkraj: {
                    [Op.lte]: `'${endDate}'` 
                }
            },
            include: [
                {
                    model: EventType,
                    as: 'tip_dogadaja'
                },
                 {
                    model: LocationModel,
                    as: 'lokacija',
                    include: {
                        model: Address,
                        as: 'adresa'
                    }
                },
                {
                    model: Place,
                    as: 'mjesto2',
                    include: {
                        model: Country,
                        as: 'drzava'
                    }
                },
                {
                    model: User,
                    as: 'korisnik'
                }
            ], 
           raw: true 
        });
    } else {
        return EventModel.findAll({
            include: [
                {
                    model: EventType,
                    as: 'tip_dogadaja'
                },
                 {
                    model: LocationModel,
                    as: 'lokacija',
                    include: {
                        model: Address,
                        as: 'adresa'
                    }
                },
                {
                    model: Place,
                    as: 'mjesto2',
                    include: {
                        model: Country,
                        as: 'drzava'
                    }
                },
                {
                    model: User,
                    as: 'korisnik'
                }
            ], 
            raw: true, 
            where: {
                    dogadajvidljiv: true 
                }
        });
    }
}

// dohvati sve slike dogadaja
const getAllEventsImages = () => {
    return Image.findAll({
        raw: true,
        include: ['dogadaj'],
        group: ['sifdogadaj', 'korisnickoime', 'sifslika']
    });
}


module.exports = {
    EventModel,
    findEventById,
    findEventsByUser,
    findOrCreateEvent,
    findAllEvents,
    deleteEvent,
    findEventsByTypeId,
    updateEvent,
    searchEvents,
    findFilteredEvents,
    getAllEventsImages,
    findFilteredEventLocations,
    searchEventsList 
}