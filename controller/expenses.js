const  mongoose = require('mongoose');
const Expense = require('../models/expenses');
const User = require('../models/users');
const DownloadedFiles = require('../models/downloadedfiles')
const S3services = require('../services/S3services');
const UserServices = require('../services/userservices');

const addExpense = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
       const { expenseAmount, expenseDescription, expenseCategory } = req.body;

       const expense = new Expense({
        expenseAmount: expenseAmount,
        expenseDescription: expenseDescription,
        expenseCategory: expenseCategory,
        userId: req.user._id
         });
       await expense.save({session});

       const user = await User.findById(req.user._id);
       user.totalExpense += Number(expenseAmount);
       await user.save({ session });

       await session.commitTransaction();
       session.endSession();
       res.status(200).json({ success: 'Successfully added' });
    } 
    catch(err) {
        await session.abortTransaction();
        session.endSession();
        console.log(err);
        res.status(500).json({ error: 'Failed to add expense' });
    }
};

const getExpense = async(req,res,next)=> {
    try{
    const page = Number(req.query.Page);
    const itemPerPage = Number(req.query.limit);
    let expenses = await Expense.find({'userId':req.user.id})
                                 .limit(itemPerPage)
                                 .skip((page-1)*itemPerPage)
                                 .exec()

    
    console.log(expenses);
    const totalItems = await Expense.countDocuments({'userId':req.user.id})
    res.json({
        expenses:expenses,
       pageData:{ 
        currentPage:page, 
        nextPage :Number(page)+1,
        previousPage:Number(page)-1,
        hasNextPage:itemPerPage * page < totalItems,
        hasPreviousPage:page > 1,
        lastPage:Math.ceil(totalItems/itemPerPage)}
    });
}
catch (err){
    console.log(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
}
}


  const downloadExpenses =  async(req, res,next) => {
    try {
    const expenses =  await Expense.find({userId : req.user._id});
    //console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user._id;

    const filename = `Expenses${userId}/${new Date()}.txt`;
    const fileURL = await S3services.uploadToS3(stringifiedExpenses,filename);
    const download =  new DownloadedFiles({
                     fileURL:fileURL,
                     userId:userId
                     });
    await download.save();
    
    res.status(200).json ({ fileURL, success: true});
    }
    catch (err){
        console.error(err);
        res.status(500).json({fileURL:'',success:false,err:err});

    }

}

  

const postDeleteExpense = async (req, res,next) => {
    const session =await mongoose.startSession();
      session.startTransaction();
   try {
    const expenseId = req.params.id;
    const expense  =await Expense.findById(expenseId)
    const expenseAmount = Number(expense.expenseAmount);
     await expense.deleteOne({session});
     console.log("Deleted Sucessfully");
     
     const user = await User.findById(req.user._id);
     user.totalExpense -= expenseAmount;
     await user.save({ session });

     await session.commitTransaction();
     session.endSession();
     return res.json({ success: 'Successfully Deleted' });
   
     }catch(err){
        await session.abortTransaction();
        session.endSession();
         console.log(err)
         return res.status(500).json({success:false,error:err})
   
   }
};
module.exports={
    addExpense,
    getExpense,
    downloadExpenses,
    postDeleteExpense
}

