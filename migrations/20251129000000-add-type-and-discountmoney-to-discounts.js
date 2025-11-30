'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm cột type với default = 1
    await queryInterface.addColumn('discounts', 'type', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });

    // Thêm cột discountmoney với allowNull = true
    await queryInterface.addColumn('discounts', 'discountmoney', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    // Cập nhật tất cả dữ liệu hiện có: type = 1, discountmoney = null
    await queryInterface.sequelize.query(
      `UPDATE discounts SET type = 1, discountmoney = NULL WHERE type IS NULL OR discountmoney IS NULL;`,
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('discounts', 'discountmoney');
    await queryInterface.removeColumn('discounts', 'type');
  },
};
