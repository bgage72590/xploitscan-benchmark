"use strict";

const { encrypt, decrypt } = require("../utils/fieldCrypto");

module.exports = (sequelize, DataTypes) =>
  sequelize.define("Employee", {
    name: { type: DataTypes.STRING, allowNull: false },
    ssn: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue("ssn", encrypt(value));
      },
      get() {
        const stored = this.getDataValue("ssn");
        return stored ? decrypt(stored) : null;
      },
    },
  });
