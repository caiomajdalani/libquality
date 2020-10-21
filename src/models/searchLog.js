
module.exports = (sequelize, DataType) => {
    const SearchLog = sequelize.define('searchlog', {
        user: {
            type: DataType.STRING,
            allowNull: false,
        },
        project: {
            type: DataType.STRING,
            allowNull: false
        }
    });
    return SearchLog;
}

    