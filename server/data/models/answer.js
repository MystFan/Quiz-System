/// <reference path="../../../typings/mongoose/mongoose.d.ts" />
var mongoose = require('mongoose');

module.exports = {
    init: function () {
        var answerSchema = new mongoose.Schema({
            text: { type: String, require: true },
            createdOn: { type: Date, require: true, default: Date.now() },
            author: { type: String, require: true },
            isCorrect: { type: Boolean, require: true },
        });

        var Answer = mongoose.model('Answer', answerSchema);
    }
}