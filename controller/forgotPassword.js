const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
const path = require('path');
const User = require('../models/users');
const forgotPasswordRequests = require('../models/forgotPasswordRequests');
require('dotenv').config();


const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        console.log(req.body)
        const user = await User.find({'email' :email})
        if(user)
        {
           
            let newRequest= new forgotPasswordRequests({
                isActive:true,
                userId: user[0]._id
            })
            await newRequest.save();

        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey =process.env.SENDINBLUE_API_KEY;
        

        const apiInstance = new Sib.TransactionalEmailsApi();

        const sender={
            email:'saitejaracharla17@gmail.com'
        }
        // Send transactional email
        await apiInstance.sendTransacEmail({
            sender ,
            to:[{email:email}],
            subject: "Reset your password",
            textContent: "Click here to reset your password",
            htmlContent: `<html>
            <h1>Click the link below to reset your Password</h1>
            <a href='http://localhost:3000/password/resetpassword/${newRequest._id}'>Reset your Password</a>
            </html>`
        });
    }
    else{
        throw new Error('user doesnt exist');
    }

        // Send success response
        return res.status(200).json({ message: 'Link to reset password sent', success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to send reset password email', success: false });
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const id = req.params.id;
        const forgotpasswordrequests = await forgotPasswordRequests.findOne({ '_id':  id  });
        

        if (forgotpasswordrequests && forgotpasswordrequests.isActive) {
             forgotpasswordrequests.isActive =false ;
             forgotpasswordrequests.save();

             const htmlContent =`<!DOCTYPE html>
             <html lang="en">
             <head>
               <meta charset="UTF-8">
               <title>Reset Password</title>
               <style>
                 body {
                   font-family: Arial, sans-serif;
                   margin: 0;
                   padding: 0;
                   text-align: center; 
                   background-color: #f4f4f4;
                 }
                 h1 {
                   margin-top: 20px;
                   text-align: center;
                 }
             
                 form {
                   width: 50%;
                   margin: 0 auto;
                   text-align: left; 
                 }
             
                 label {
                   display: block;
                   margin-bottom: 5px;
                 }
             
                 input[type="password"] {
                   width: 100%;
                   padding: 8px;
                   margin-bottom: 15px;
                   border-radius: 5px;
                   border: 1px solid #ccc;
                   box-sizing: border-box;
                 }
             
                 button[type="submit"] {
                   padding: 10px 20px;
                   background-color: #4CAF50;
                   color: white;
                   border: none;
                   border-radius: 5px;
                   cursor: pointer;
                   display: inline-block;
                 }
             
                 button[type="submit"]:hover {
                   background-color: #45a049;
                 }
               </style>
             </head>
             <body>
               <h1>Reset Password</h1>
               <form id='form' action="http://localhost:3000/password/updatepassword/${id}" method="post">
                  <label for="newpassword">Enter New Password</label>
                   <input name="newpassword" type="password" required></input>
                   <button type="submit">Reset Password</button>
               </form>
               </body>
             </html>
             `

            // Send the password reset form to the user
            res.status(200).send(htmlContent);
            //res.status(200).sendFile(path.join(__dirname,'../', 'public','Frontend','resetPassword.html'))
        } else {
            res.status(404).send('Password reset request not found or already used.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}
 const updatePassword = async(req , res , next) =>{
    try{
        const {newpassword} = req.body;
        //console.log(req.body);
        const resetpasswordId = req.params.id;
        let forgotpasswordrequests = await forgotPasswordRequests.findOne({'_id':resetpasswordId});
        let user = await User.findOne({'_id' : forgotpasswordrequests.userId});
        const saltRounds =10;
        const hashedPassword = await bcrypt.hash(newpassword,saltRounds);
        user.password = hashedPassword;
        user.save();
        console.log("Succesfully updated")
        return res.status(201).json({ message: 'Successfully updated the new password', success: true });
    }
    catch (err){
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', success: false });
    }
    }
 
    module.exports = {
        forgotPassword,
        updatePassword,
        resetPassword
    }