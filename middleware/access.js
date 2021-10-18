function userAccess(req, res, next) {
    if (req.isAuthenticated()) { // isAuthenticated basically means if ur logged in
        res.redirect('/dashboard');
    }
    else {
        next();
    }
}

function guestAccess(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.redirect('/');
    }
}

module.exports =
{
    giveUser: userAccess,
    giveGuest: guestAccess,
}

