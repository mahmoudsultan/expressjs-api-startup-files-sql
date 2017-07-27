module.exports = function (sequalize, DataTypes) {
    return sequalize.define('categories', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
            name: {
                singular: 'category',
                plural: 'categories'
            }
        });
};