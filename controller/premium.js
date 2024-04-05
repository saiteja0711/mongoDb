const User = require('../models/users');

exports.getleaderboard = async (req, res, next) => {
    try {
        const userLeaderboardDetails = await User.find({})
                                                 .select('name totalExpense')
                                                 .sort({totalExpense:-1});
        
        res.status(200).json(userLeaderboardDetails);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
