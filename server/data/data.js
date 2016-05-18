/// <reference path="../../typings/mongoose/mongoose.d.ts" />
var Category = require('mongoose').model('Category'),
    Question = require('mongoose').model('Question'),
    Answer = require('mongoose').model('Answer'),
    Quiz = require('mongoose').model('Quiz'),
    User = require('mongoose').model('User'),
    encryption = require('../utilities/encryption');

module.exports = {
    users: {
        create: function create(req, res) {
            var user = req.body,
                result = {
                    success: true,
                    errorMessage: '',
                    user: user
                },
                salt, hashPassword;

            var validationResult = validateUser(user);

            if (!validateUser.isValid) {
                result.success = validationResult.isValid;
                result.errorMessage = validationResult.errorMessage;
                res.send(result);
                return;
            }

            salt = encryption.generateSalt();
            hashPassword = encryption.generateHashedPassword(salt, user.password);
            console.log(user);
            User.find({ username: user.username }).exec(function (err, users) {
                if (err) {
                    console.log('User cannot be found! ' + err);
                }

                if (users.length) {
                    result.success = false;
                    result.errorMessage = 'Username allready exist!';
                    res.send(result);
                }
                else {
                    User.create({ username: user.username, firstName: user.firstName, lastName: user.lastName, salt: salt, hashPassword: hashPassword, roles: ['user'] },
                        function (err, user) {
                            if (err) {
                                console.log('Cannot create user! ' + err);
                            }

                            result.success = true;
                            result.user = user;
                            res.send(user);
                        });
                }
            })
        }
    },
    categories: {
        all: function all(req, res) {
            Category.find({})
                .exec(function (err, categories) {
                    if (err) {
                        console.log("Cannot find categories! " + err);
                    }

                    res.send({ categories: categories });
                });
        }
    },
    quizzes: {
        all: function all(req, res) {
            var page = parseInt(req.query.page),
                pageSize = parseInt(req.query.pageSize);

            Quiz.find({ 'questions': { $not: { $size: 0 } } }, {}, { skip: page * pageSize, limit: pageSize })
                .exec(function (err, quizzes) {
                    if (err) {
                        console.log("Cannot find quizzes! " + err);
                    }

                    Quiz.count({ 'questions': { $not: { $size: 0 } } }, function (err, count) {
                        if (err) {
                            console.log("Cannot count quizzes! " + err);
                        }

                        res.send({ totalQuizzes: count, quizzes: quizzes });
                    })
                })
        },
        create: function create(req, res) {
            var quiz = req.body;
            var author = req.user.username;

            Quiz.create({ category: quiz.category, questions: quiz.questions, author: author }, function (err, quiz) {
                if (err) {
                    console.log("Cannot create quiz! " + err);
                }

                res.send(quiz);
            });
        },
        getById: function getById(req, res) {
            var id = req.params.id;

            Quiz.findOne({ _id: id }, function (err, quiz) {
                if (err) {
                    console.log("Canot find quiz by id! " + err);
                    res.status(500).send(err);
                } else {
                    res.send(quiz);
                }
            });
        }
    },
    questions: {
        count: function count(req, res) {
            Question.count({}, function (err, count) {
                if (err) {
                    console.log("Cannot count questions! " + err);
                }

                res.send({ totalQuestions: count });
            })
        },
        byCategory: function byCategory(req, res) {
            var category = req.params.category;

            Question.find({ category: category }).exec(function (err, questions) {
                if (err) {
                    console.log("Cannot find questions by category! " + err);
                }

                res.send(questions);
            })
        },
        all: function all(req, res) {
            var page = parseInt(req.query.page),
                pageSize = parseInt(req.query.pageSize);

            var query = req.query.category !== 'undefined' ? { category: req.query.category } : '' || {};

            Question.find(query, {}, { skip: page * pageSize, limit: pageSize })
                .exec(function (err, questions) {
                    if (err) {
                        console.log("Cannot find questions! " + err);
                    }

                    res.send(questions);
                })
        },
        create: function create(req, res) {
            var question = req.body;
            var corectAnswerIndex = parseInt(question.index);
            var answers = question.answers.map(function (answer, index) {
                var isCorrect = false;
                if (index === corectAnswerIndex) {
                    isCorrect = true;
                }

                return {
                    text: answer,
                    author: req.user.username,
                    isCorrect: isCorrect
                }
            })

            //     "mongoose": "4.3.4",

            Category.find({ text: question.category }).exec(function (err, category) {
                if (err) {
                    console.log("Cannot find category! " + err);
                }

                var questionToSave = new Question({ text: question.text, category: question.category, answers: answers });
                questionToSave.save(function (err, question) {
                    if (err) {
                        console.log("Cannot find questions! " + err);
                    }

                    res.send(question);
                })
            })
        },
        remove: function remove(req, res) {
            var id = req.body.id;

            Question.find({ _id: id }).remove(function (err, question) {
                if (err) {
                    console.log("Cannot find question to remove! " + err);
                }

                res.send(question);
            })
        }
    }
}

function validateUser(user) {
    var USERNAME_MIN_LENGTH = 6,
        USERNAME_MAX_LENGTH = 20,
        PASSWORD_MIN_LENGTH = 6,
        PASSWORD_MAX_LENGTH = 20,
        FIRST_NAME_MIN_LENGTH = 2,
        FIRST_NAME_MAX_LENGTH = 50,
        LAST_NAME_MIN_LENGTH = 2,
        LAST_NAME_MAX_LENGTH = 50,
        allowedSymbols = 'abcdefghijklmnopqrstuvwxyz0123456789',
        result = { errorMessage: '', isValid: true };

    if (user.username.length < USERNAME_MIN_LENGTH || user.username.length > USERNAME_MAX_LENGTH) {
        result.isValid = false;
        result.errorMessage = 'Username must be between ' + USERNAME_MIN_LENGTH + ' and ' + USERNAME_MAX_LENGTH + ' characters long!';
    }

    if (user.password.length < PASSWORD_MIN_LENGTH || user.password.length > PASSWORD_MAX_LENGTH) {
        result.isValid = false;
        result.errorMessage = 'Password must be between ' + PASSWORD_MIN_LENGTH + ' and ' + PASSWORD_MAX_LENGTH + ' characters long!';
    }

    if (user.firstName.length < FIRST_NAME_MIN_LENGTH || user.firstName.length > FIRST_NAME_MAX_LENGTH) {
        result.isValid = false;
        result.errorMessage = 'First name must be between ' + FIRST_NAME_MIN_LENGTH + ' and ' + FIRST_NAME_MAX_LENGTH + ' characters long!';
    }

    if (user.lastName.length < LAST_NAME_MIN_LENGTH || user.lastName.length > LAST_NAME_MAX_LENGTH) {
        result.isValid = false;
        result.errorMessage = 'Last name must be between ' + LAST_NAME_MIN_LENGTH + ' and ' + LAST_NAME_MAX_LENGTH + ' characters long!';
    }

    if (!validateString(user.username, allowedSymbols)) {
        result.isValid = false;
        result.errorMessage = 'Username contains invalid symbols!';
    }

    if (!validateString(user.firstName, allowedSymbols)) {
        result.isValid = false;
        result.errorMessage = 'First name contains invalid symbols!';
    }

    if (!validateString(user.lastName, allowedSymbols)) {
        result.isValid = false;
        result.errorMessage = 'Last name contains invalid symbols!';
    }

    if (!validateString(user.password, allowedSymbols)) {
        result.isValid = false;
        result.errorMessage = 'Password contains invalid symbols!';
    }

    return result;
}

function validateString(value, symbols) {
    var isValid = true,
        index = 0,
        len = value.length;

    for (index = 0; index < len; index += 1) {
        if (symbols.indexOf(value[index].toLowerCase()) < 0) {
            isValid = false;
            break;
        }
    }

    return isValid;
}