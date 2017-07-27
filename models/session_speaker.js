module.exports = function (sequalize, DataTypes) {
    return sequalize.define('session_speaker', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
        // category_id: {
        // type: DataTypes.INTEGER,
        // references: { model: 'categories', key: 'id' }
        // },
        // session_id: {
        // type: DataTypes.INTEGER,
        // references: { model: 'sessions', key: 'id' }
        // }
    });
}
