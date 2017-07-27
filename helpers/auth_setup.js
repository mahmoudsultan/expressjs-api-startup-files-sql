const User = require('./../models/main')('user');

module.exports = function strategySetup(BearerStrategy, next) {
    return new BearerStrategy(function (token, callback) {
        User.findOne({
            where: {
                token: token
            }
        }).then(function (user) {
            // console.log(user);
            if (!user) {
                return callback(null, false);
            }
            return callback(null, user, { scope: 'all' });
        }).catch(function (error) {
            return callback(error);
        });
    });
}