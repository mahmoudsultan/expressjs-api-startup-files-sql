module.exports = function (sequalize, DataTypes) {
    return sequalize.define('hashtag_post', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // tag_id: {
            // type: DataTypes.INTEGER,
            // references: { model: 'hashtags', key: 'id' }
        // },
        // post_id: {
            // type: DataTypes.INTEGER,
            // references: { model: 'posts', key: 'id' }
        // }
    });
}