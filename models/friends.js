'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friends extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Friends.init(
    {
      friendsId: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      loginId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      friend: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      confirm: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null
      },
      valid: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null
      },
  }, 
    {
      sequelize,
      modelName: 'Friends',
      timestamps: true,
    });
    return Friends;
};