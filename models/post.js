module.exports = function (sequalize, DataTypes) {
    return sequalize.define('posts', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: false,
            validate: {
                len: {
                    args: [10, 150],
                    msg: "Please provide content for the post with a length between 10, and 150 characters"
                }
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            // allowNull:false,
            unique: false
        }
    });
};