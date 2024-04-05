const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateToken(_id ,isPremium ){
    return jwt.sign({userId:_id , isPremium:isPremium},'secretkey')
}

async function loginUser (req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await Users.find( { 'email': email } );
        
        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }
        console.log(user);

        bcrypt.compare(password, user[0].password, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (result) {
                return res.json({ success: 'User logged in successfully!',token:generateToken(user[0]._id, user[0].isPremium)});
            } else {
                return res.status(401).json({ error: 'Wrong password!' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
module.exports={
    generateToken,
    loginUser
}