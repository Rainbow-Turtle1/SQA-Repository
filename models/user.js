<<<<<<< HEAD
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
=======
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  
>>>>>>> 676e230 (feat/add-basic-register-functionality)

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
<<<<<<< HEAD
    allowNull: false,
=======
    allowNull: false
>>>>>>> 676e230 (feat/add-basic-register-functionality)
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
<<<<<<< HEAD
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default User;
=======
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = { sequelize, User };
>>>>>>> 676e230 (feat/add-basic-register-functionality)
