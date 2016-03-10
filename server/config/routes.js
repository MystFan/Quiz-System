var auth = require('./auth'),
    mongoose = require('mongoose');

var User = mongoose.model('User');
module.exports = function (app) {

    app.get('/api/users', auth.isInRole('admin'),
        
        function (req, res) {
            User.find({}).exec(function (err, users) {
                if (err) {
                    console.log(err);
                }

                res.send(users);
            })
        })

    app.get('/partials/:partialAria/:partialName', function (req, res) {
        res.render('../../public/app/' + req.params.partialAria + '/' + req.params.partialName)
    });

    app.post('/login', auth.login);
    app.post('/logout', auth.logout);

    app.get('*', function (req, res) {
        res.render('index', { currentUser: req.user });
    });
}