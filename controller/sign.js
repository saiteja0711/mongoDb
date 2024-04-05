const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.addUser = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        
        const saltRounds = 10;
      bcrypt.hash(password, saltRounds, async(err,hashedPassword)=>{
        console.log(err)
        try {
            //await Users.create({ name, email, password: hash });
            const user = new Users({
                name:name,
                email:email,
                password:hashedPassword
            })
            user.save();
            res.status(201).json({ message: 'Successfully created new user' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error creating user' });
        };
     });
} catch (err) {
        res.status(500).json(err);
    }
};


