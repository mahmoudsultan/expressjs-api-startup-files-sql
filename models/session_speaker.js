module.exports = function (sequalize, DataTypes) {
    return sequalize.define('session_speaker', {
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
