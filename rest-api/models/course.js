'use strict';
const { Model, DataTypes } = require('sequelize');
//const bcrypt = require('bcrypt');


module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A title is required'
        },
        notEmpty: {
          msg: 'Please provide a title'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A decscritpion is required'
        },
        notEmpty: {
          msg: 'Please provide a description'
        }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING,  
     
    },
    materialsNeeded: {
      type: DataTypes.STRING,
     
    },
    // user ID

  }, { sequelize });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
        foreignKey: {
          fieldName: 'userId',
          allowNull: false,
        },
      });
    
  };
  

  return Course;
};