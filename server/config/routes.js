var auth = require('./auth'),
    mongoose = require('mongoose'),
    data = require('../data/data');

var User = mongoose.model('User');
module.exports = function(app) {

    app.get('/api/users', auth.isInRole('admin'),

        function(req, res) {
            User.find({}).exec(function(err, users) {
                if (err) {
                    console.log(err);
                }

                res.send(users);
            })
        });
        
    app.get('/api/categories', data.categories.all); 
    app.get('/api/quizzes', data.quizzes.all); 
    app.get('/api/quizzes/:id', data.quizzes.getById);  
    app.post('/api/quiz-create', auth.isAuthenticated, data.quizzes.create);
    app.get('/api/questions-count', data.questions.count);
    //app.get('/api/questions/:category', data.questions.byCategory); 
    app.get('/api/questions', data.questions.all);         
    app.post('/api/questions', auth.isAuthenticated, data.questions.create);    
    app.post('/api/questions/remove', auth.isInRole("admin"), data.questions.remove);    

    app.get('/partials/:partialAria/:partialName', function(req, res) {
        res.render('../../public/app/' + req.params.partialAria + '/' + req.params.partialName)
    });

    app.post('/register', data.users.create);
    app.post('/login', auth.login);
    app.post('/logout', auth.logout);

    app.get('*', function(req, res) {
        res.render('index', { currentUser: req.user });
    });
}