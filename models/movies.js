module.exports = function (sequalize, DataTypes) {
    return sequalize.define('movies', {
        title: {
            type: DataTypes.STRING,
            // add other proberties
            allowNull: false,
            unique: true,
            validate: {
                len: {
                    args: [10, 150],
                    msg: "Please provide a title with a length between 10, and 150 characters"
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            // defaultValue: 'comming soon...'
        }
    });
};