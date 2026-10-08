"use strict";

// Bank details live in Stripe Connect; the tax ID is encrypted with
// lib/kms.js before it is assigned, so only ciphertext reaches the table.
module.exports = (sequelize, DataTypes) => {
  const PayoutAccount = sequelize.define("PayoutAccount", {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    accountHolder: { type: DataTypes.STRING, allowNull: false },
    encryptedTaxId: { type: DataTypes.TEXT, allowNull: false },
    taxIdLast4: { type: DataTypes.STRING(4), allowNull: false },
    stripeAccountId: { type: DataTypes.STRING, allowNull: false },
  });

  PayoutAccount.associate = (models) => {
    PayoutAccount.belongsTo(models.User, { foreignKey: "userId" });
  };

  return PayoutAccount;
};
