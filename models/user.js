const bcrypt = require('bcrypt-nodejs');

module.exports = function (sequelizer, DataTypes) {
    return sequelizer.define('users', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        alias: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [8, 30],
                    msg: "Password length should be between 8 and 30 characters"
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: {
                    args: true,
                    msg: "Email provided is invalid"
                }
            }
        },
        collage: {
            type: DataTypes.STRING
        },
        department: {
            type: DataTypes.STRING
        },
        key: {
            type: DataTypes.STRING,
            unique: true
        },
        token: {
            type: DataTypes.STRING,
            unique: true
        },
        activated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
        // TODO Add avatar
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