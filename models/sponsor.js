module.exports = function (sequalize, DataTypes) {
    return sequalize.define('sponsors', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        link: {
            type: DataTypes.STRING,
            unique: true
        },
        type: {
            type: DataTypes.STRING
        }
        // TODO: add image
    });
};