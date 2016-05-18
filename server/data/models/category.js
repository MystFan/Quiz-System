var mongoose = require('mongoose');

module.exports = {
    init: function () {
        var categorySchema = new mongoose.Schema({
            text: { type: String, require: true }
        });

        var Category = mongoose.model('Category', categorySchema);
        
        Category.find({}).exec(function(err, categories){
            if (err) {
                console.log("Cannot find categories: " + err);
                return;
            }
            
            if(!categories.length){
                Category.create({ text: 'Movies'});
                Category.create({ text: 'Sports'});
                Category.create({ text: 'Music'});
                Category.create({ text: 'Other'});              
            }
        });
    }
}