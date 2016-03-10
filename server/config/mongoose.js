var mongoose = require('mongoose'),
    encryption = require('../utilities/encryption'),
    User = require('../data/models/user'),
    Question = require('../data/models/question');

module.exports = function (config) {
    mongoose.connect(config.db);

    var db = mongoose.connection;

    db.once('open', function (err) {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Database up and running...');
    })

    db.on('error', function (err) {
        console.log(err);
    });

    User.init();
    Question.init();
}