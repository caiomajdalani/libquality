
module.exports = (sequelize, DataType) => {
    const Project = sequelize.define('project', {
        repository: {
            type: DataType.STRING,
            allowNull: false
        },
        issues: {
            type: DataType.INTEGER,
            allowNull: true
        },
        avgAge: {
            type: DataType.INTEGER,
            allowNull: true
        },
        stdAge: {
            type: DataType.INTEGER,
            allowNull: true
        },
        active: {
            type: DataType.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['repository', 'active'],
                where: {
                  active: true
                }
            }
        ]
    });
    return Project;
}

    