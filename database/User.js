const Sequelize= require('sequelize');
const db= require('./database');
const bcrypt = require("bcryptjs");

const User=db.define('korisnik',{
    korisnickoime:{
        type: Sequelize.STRING,
        primaryKey: true,
    },
    sifvrstakorisnik:{
        type: Sequelize.INTEGER
    },
    ime : {
        type: Sequelize.STRING
    },
    prezime : {
        type: Sequelize.STRING
    },
    email : {
        type: Sequelize.STRING,
    },
    lozinka : {
        type: Sequelize.STRING,
    },
},{
    tableName : 'korisnik',
    timestamps : false
});

const findUserByUserName = (username) => {
    return User.findOne({
        where: {
          korisnickoime: username
        },
        raw: true
    });
}

const isAdmin = (username) => {
    return User.findOne({
        where: {
          korisnickoime: username
        }, raw:true
    }).then(user => {
        razina_korisnik = user.sifvrstakorisnik;
        if(razina_korisnik===1){
            return true
        } else return false;
    }).catch(err=>console.log(err)); 
}

const findOrCreateUser = (newUser) => {
    return User.findOrCreate({
        where: {
        korisnickoime: newUser.username
        },
        defaults:{
          korisnickoime: newUser.username,
          sifvrstakorisnik: 2,
          ime: newUser.name,
          prezime: newUser.lastName,
          email: newUser.email,
          lozinka: newUser.password
        }
      });
}

const editUser = (oldUser, newUser) => {
    const createUser = {
        username: oldUser.username,
        name: oldUser.name,
        lastName: oldUser.lastName,
        email: oldUser.email,
		password: oldUser.password
    };
    
    if(newUser.username) {
        createUser.username = newUser.username;
    }
    if(newUser.name) {
        createUser.name = newUser.name;
    }
    if(newUser.lastName) {
        createUser.lastName = newUser.lastName;
    }

    if(newUser.email) {
        createUser.email = newUser.email;
    }
    if(newUser.password) {
        createUser.password = newUser.password;
    }

    return User.findAll({
        where: {
          korisnickoime: oldUser.username
        },
        raw: true
    }).then(function(result) {
		if(!newUser.password) { // korisnik nije mijenjao lozinku
            return User.update(
            {
               korisnickoime: createUser.username,
               ime: createUser.name,
               prezime: createUser.lastName,
               email: createUser.email,
               lozinka: createUser.password
            },
            {
                where: {
                    korisnickoime: oldUser.username
                }
            }
            )
        } else { // korisnik mijenjao lozinku
                bcrypt.hash(newUser.password, 10, (err, hash) => {
                    createUser.password = hash;
                    return User.update(
                        {
                           korisnickoime: createUser.username,
                           ime: createUser.name,
                           prezime: createUser.lastName,
                           email: createUser.email ,
                           lozinka: createUser.password
                        },
                        {
                            where: {
                                korisnickoime: oldUser.username
                            }
                        }
                        )
                });
        }
		
	});
}

module.exports = {
    User,
    findUserByUserName,
    findOrCreateUser,
    isAdmin,
    editUser
}