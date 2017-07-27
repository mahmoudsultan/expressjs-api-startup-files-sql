module.exports = function (sequalize, DataTypes) {
    return sequalize.define('speakers', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        linkedin: {
            type: DataTypes.STRING,
            unique: true
        }
    });
};