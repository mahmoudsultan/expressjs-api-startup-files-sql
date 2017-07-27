var uuid = require('uuid');

module.exports = function generateToken(User, v4, callback) {
    var token = null;
    if (v4) {
        token = uuid.v4()
    } else {
        token = uuid.v1();
    }
    // console.log(token);
    User.findOne({
        where: {
            token: token
        }
    }).then(function (user) {
        // console.log("User with this token exist..")
        if (user) {
            callback(generateToken(User, true));
        } else {
            // console.log(token);
            callback(token);
        }
    }).catch(function (error) {
        // console.log(error);
        throw new Error("Internal server error");
    });
}