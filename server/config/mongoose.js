var mongoose = require('mongoose'),
    encryption = require('../utilities/encryption'),
    User = require('../data/models/user'),
    Question = require('../data/models/question'),
    Answer = require('../data/models/answer'),
    Category = require('../data/models/category'),
    Quiz = require('../data/models/quiz');

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
    Answer.init();    
    Question.init();
    Category.init();
    Quiz.init();
}