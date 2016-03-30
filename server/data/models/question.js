var mongoose = require('mongoose');

module.exports = {
    init: function () {
        Answer = mongoose.model('Answer').schema;
        var questionSchema = new mongoose.Schema({
            text: { type: String, require: true },
            createdOn: { type: Date, require: true, default: Date.now() },
            author: { type: String, require: true },
            category: { type: String, require: true },
            answers: {type:[Answer]}
        });

        var Question = mongoose.model('Question', questionSchema);
        
        Question.find({}).exec(function(err, questions){
            if (err) {
                console.log("Cannot find questions: " + err);
                return;
            }
            
            if(!questions.length){
                Question.create({ text: 'To be or not to be?', author: "anonimus", category: 'other'});
            }
        });
    }
}