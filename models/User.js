const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {
    // instance method to check password property of each user
    checkPassword(loginPW) {
        return bcrypt.compareSync(loginPW, this.password);
    }
}

// define table columns and configuration
User.init(
  {
    // TABLE COLUMN DEFINITIONS GO HERE
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8]
        }
    }
  },
  {
  hooks: {
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10)
        return newUserData;
        },

        async beforeUpdate(updatedUserData) {
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10)
            return updatedUserData;
        }
    },
       // pass in our imported sequelize connection (the direct connection to our database)
       sequelize,
       timestamps: false,
       freezeTableName: true,
       underscored: true,
       modelName: 'user'
     }
   );

  
 

module.exports = User;