const express = require('express');
const router = express.Router();
const { giveGuest } = require('../middleware/access');
const StoryModel = require('../models/StoryModel');
const UserModel = require('../models/UserModel');

// GET ADD PAGE
router.get('/add', giveGuest, (req, res) => {
    res.render('stories/add');
    console.log(global.global);
})


// Get all public stories
router.get('/', giveGuest, async (req, res) => {

    let loggedArr = [];
    let otherUsersArr = [];

    try {
        // below were getting all the stories from specific user that are of status public
        // populate basically replaces the specified property with the related document in the connected collection
        // below will return public stories for all users
        const allPublicStories = await StoryModel.find({ status: "public" })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean();

        allPublicStories.forEach((each) => {
            if (each.user._id == req.user.id) {
                loggedArr.push(each);
            }
            else {
                otherUsersArr.push(each);
            }
        })


        console.log(loggedArr);
        console.log(otherUsersArr);

        res.render('stories/publicStories',
            {
                logged: loggedArr,
                otherUsers: otherUsersArr
            });
    } catch (err) {
        console.log(err);
        res.render('error');
    }
});


// GET SINGLE STORY PAGE
router.get('/:postId', giveGuest, async (req, res) => {
    try {
        const singleStory = await StoryModel.findById(req.params.postId).lean();
        console.log(`SINGLE STORY: ${singleStory}`);
        res.render('stories/singleStory',
            {
                single: singleStory
            });
    } catch (err) {
        console.log(err);
        res.render('error');
    }

})


// GET POSTS FOR SINGLE USER
router.get('/user/:userId', giveGuest, async (req, res) => {
    try {
        const postsFromUser = await StoryModel.find({ user: req.params.userId })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean();
        console.log(postsFromUser);
        res.render('singleUserPosts',
            {
                userStories: postsFromUser,
                single: postsFromUser[0]
            })
    } catch (error) {
        console.log(err);
        res.render('error');
    }
})


// POST STORIES
// POST /stories
router.post('/', giveGuest, async (req, res) => {
    try {
        // req.user contains the authenticated user
        // so adding req.body.user = req.user.id makes sure the posted story is based on the user logged in
        req.body.user = req.user.id;
        await StoryModel.create(req.body);
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        res.render('error');
    }
})


// GET EDIT PAGE
router.get('/edit/:storyId', giveGuest, async (req, res) => {
    try {
        const singleStory = await StoryModel.findById(req.params.storyId).lean();
        console.log(`THIS IS SINLGE POST: ${singleStory}`);

        if (!singleStory) {
            console.log(err);
            res.render('error');
        }

        if (singleStory.user != req.user.id) {
            res.redirect('/stories');
        }
        else {
            res.render('stories/edit',
                {
                    editStory: singleStory
                })
        }
    } catch (error) {
        console.log(err);
        res.render('error');
    }
})

router.put('/edit/:storyId', giveGuest, async (req, res) => {
    try {
        const updatePost = await StoryModel.findByIdAndUpdate(req.params.storyId, req.body);
        console.log(req.body); // REQ.BODY MEANS WHAT WE ARE ENTERING
        // so in the above findbyIdAndUpdate, we are finding the story when the passed in iD and replacing it with req.body
        console.log(updatePost);
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        res.render('error');
    }
})



// DELETE STORIES BASED ON ID
// /delete/:id
router.delete('/delete/:storyId', giveGuest, async (req, res) => {
    try {
        const deletePost = await StoryModel.findByIdAndDelete(req.params.storyId);
        // so in the above findbyIdAndUpdate, we are finding the story when the passed in iD and replacing it with req.body
        console.log(deletePost);
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        res.render('error');
    }
})




module.exports = router;