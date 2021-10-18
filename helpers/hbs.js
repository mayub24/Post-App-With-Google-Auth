const moment = require('moment');

module.exports = {
    formatDate: function (date, format) {
        return moment(date).format(format)
    },
    removeTags: function (par) {
        var regex = /(<([^>]+)>)/ig
        return par.replace(regex, "");
    },
    editIcon: function (storyUser, loggedInUser, storyId) {
        if (storyUser._id.toString() == loggedInUser._id.toString()) {
            return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit small"></i></a>`;
        }
        else {
            return '';
        }
    },
    select: function (selected, options) {
        return options.fn(this).replace(
            new RegExp(' value=\"' + selected + '\"'),
            '$& selected="selected"');
    },
    addButtons: function (storyUser, loggedInUser, storyId) {
        console.log(`Users story: ${storyUser._id.toString()}`);
        console.log(`Logged in user: ${loggedInUser}`);
        if (storyUser._id.toString() == loggedInUser._id.toString()) {
            return `
                <div class="flex">
                     <form action="/stories/delete/${storyId}?_method=DELETE" method="POST">
                    <button type="submit" class="btn red">
                        Delete Post
                    </button>
                </form>
                <div>
                    <button class="btn blue">
                        <a href="/stories/edit/${storyId}">Edit Post</a>
                    </button>
                </div>

                <div>
                    <button class="btn green">
                        <a href="/stories">Go Back</a>
                    </button>
                </div>
                </div>
            `;
        }
        else {
            return ` <div>
                    <button class="btn green">
                        <a href="/stories">Go Back</a>
                    </button>
                </div>`;
        }
    }
}

