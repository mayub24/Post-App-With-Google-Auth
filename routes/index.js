const express = require('express');
const router = express.Router();
const { giveGuest, giveUser } = require('../middleware/access');
const StoryModel = require('../models/StoryModel');

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
        res.render('dashboard',
            {
                fName: req.user.firstName,
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
