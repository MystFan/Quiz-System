var mongoose = require('mongoose');

module.exports = {
    init: function () {
        Question = mongoose.model('Question').schema;
        var quizSchema = new mongoose.Schema({
            createdOn: { type: Date, require: true, default: Date.now() },
            author: { type: String, require: true },
            category: { type: String, require: true },
            questions: {type:[Question]}
        });

        var Quiz = mongoose.model('Quiz', quizSchema);
        
        Quiz.find({}).exec(function(err, quizzes){
            if (err) {
                console.log("Cannot find quizzes: " + err);
                return;
            }
            
            if(!quizzes.length){
                Quiz.create({ author: "anonimus", category: 'Other'});
            }
        });
    }
}