const express = require('express');
const router = express.Router();
const { giveGuest, giveUser } = require('../middleware/access');
const StoryModel = require('../models/StoryModel');
const UserModel = require('../models/UserModel');

router.get('/', giveUser, (req, res) => {
    // render means show the page login.hbs but use the layout loginLayout instead of the default main.hbs
    res.render('login',
        {
            layout: 'loginLayout'
        });
})

router.get('/dashboard', giveGuest, async (req, res) => {

    // Dashboard will list all the stories based on the users
    try {
        let story = await StoryModel.find({ user: req.user.id }).lean();
        let userz = await UserModel.findById({_id: req.user});
        console.log(userz);
        console.log(story);
        res.render('dashboard',
            {
                fName: userz.firstName,
                stories: story,
            });
    } catch (error) {
        res.render('error',
            {
                err: error.message
            })
    }
})



module.exports = router;
