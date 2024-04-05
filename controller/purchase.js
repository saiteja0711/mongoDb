const Razorpay =require('razorpay')
const Order = require('../models/order')
const jwt = require('jsonwebtoken');
const usercontroller = require('../controller/login')
require('dotenv').config();

const purchasePremium = async(req,res,next) =>{
    try{
        let rzp=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
     })
     const amount=2500
     rzp.orders.create({amount,currency:'INR'},async(err,order)=>{
        if(err){
            throw new Error('Something Went Wrong')
        }
        try{
            const neworder = new Order({
                orderId:order.id,
                status:"PENDING",
                userId:req.user._id
            })
            await neworder.save();
            return res.status(201).json({order,key_id:rzp.key_id})
        }
        catch(err){
            console.log(err)
        }
    });
   }
    catch(err){
        console.log(err)
    }
}
const updateTransaction = async(req,res,next)=>{
    try{
        const userId = req.user._id
        const {payment_id,order_id}=req.body
        console.log('req body is',req.body)

        const Promise1 = Order.updateOne({'orderId':order_id},{paymentId:payment_id,status:'SUCCESSFUL'});
        const Promise2 = req.user.updateOne({isPremium:true});

        await Promise.all([Promise1,Promise2])
        
        return res.status(202).json({success:'true',message:'Transaction Successful', token:usercontroller.generateToken(userId,true)});
        
    }
    catch(err){
        console.log(err)
    }
}
module.exports={
    purchasePremium,
    updateTransaction
}
