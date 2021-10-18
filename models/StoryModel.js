const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    // connecting stories to the user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // referencing the user document model the story schema
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Story', StorySchema);