module.exports = function (sequalize, DataTypes) {
    return sequalize.define('user_session', {
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