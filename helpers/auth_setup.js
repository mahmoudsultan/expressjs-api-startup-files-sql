const User = require('./../models/main')('users');

module.exports = function strategySetup(BearerStrategy) {
    return new BearerStrategy(function (token, callback) {
        User.findOne({
            token: token
        }, (err, user) => {
            if (err) {
                return callback(err);
            }

            if (!user) {
                return callback(null, false);
            }

            return callback(null, user, {scope: all});
        });
    });
}