module.exports = function(sequalize, DataTypes) {
    return sequalize.define('hashtags', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        count: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        hooks: {
            afterValidate: function (post, options) {
                user.count = 0;
            }
        }
    });
}