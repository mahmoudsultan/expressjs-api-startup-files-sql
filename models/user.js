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
    });
};