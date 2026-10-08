"use strict";

module.exports = (sequelize, DataTypes) => {
  const PayoutAccount = sequelize.define("PayoutAccount", {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    accountHolder: { type: DataTypes.STRING, allowNull: false },
    taxId: { type: DataTypes.STRING, allowNull: false },
    bankAccountNumber: { type: DataTypes.STRING, allowNull: false },
  });

  PayoutAccount.associate = (models) => {
    PayoutAccount.belongsTo(models.User, { foreignKey: "userId" });
  };

  return PayoutAccount;
};
