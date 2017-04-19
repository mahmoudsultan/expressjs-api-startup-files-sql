const bcrypt = require('bcrypt-nodejs');

module.exports = function (sequelizer, DataTypes) {
    return sequelizer.define('users', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            unique: true
        }
    }, {
        hooks: {
            afterValidate: function (user, options) {
                // hash the password after it's validated and before inserting
                // into the table
                user.password = bcrypt.hashSync(user.password);
            }
        }
    });
};