module.exports = function (sequalize, DataTypes) {
    return sequalize.define('sessions', {
        start: {
            type: DataTypes.TIME,
            allowNull: false
        },
        end: {
            type: DataTypes.TIME,
            allowNull: false,
            // validates: {
                // isAfter: start
            // }
        },
        day: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        available: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        report_link: {
            type: DataTypes.STRING
        }
        // add after hook to validate
    });
};