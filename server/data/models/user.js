var mongoose = require('mongoose'),
    encryption = require('../../utilities/encryption'),
    secrets = require('../../../secrets');

module.exports = {
    init: function () {
        var userSchema = new mongoose.Schema({
            username: { type: String, require: true },
            firstName: String,
            lastName: String,
            salt: String,
            hashPassword: String,
            roles: [String]
        });

        userSchema.method({
            authenticate: function (password) {
                if (encryption.generateHashedPassword(this.salt, password) === this.hashPassword) {
                    return true;
                }
                else {
                    return false;
                }
            }
        });

        var User = mongoose.model('User', userSchema);

        User.find({}).exec(function (err, users) {
            if (err) {
                console.log("Cannot find users: " + err);
                return;
            }

            if (users.length === 0) {
                var salt;
                var hashPassword;

                salt = encryption.generateSalt();
                hashPassword = encryption.generateHashedPassword(salt, secrets.adminPassword);
                User.create({ username: secrets.adminUsername, firstName: 'todor', lastName: 'dimitrov', salt: salt, hashPassword: hashPassword, roles: ['admin'] });
                salt = encryption.generateSalt();
                hashPassword = encryption.generateHashedPassword(salt, '654321');
                User.create({ username: 'jhon', firstName: 'jhon', lastName: 'doe', salt: salt, hashPassword: hashPassword, roles: ['user'] });
            }
        })
    }
}