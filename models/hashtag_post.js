module.exports = function (sequalize, DataTypes) {
    return sequalize.define('hashtag_post', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    }, {
            timestamps: false
        }
    );
}