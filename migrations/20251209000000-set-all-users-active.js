'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Set tất cả users thành active (nếu muốn)
    // Hoặc chỉ set một số user cụ thể
    await queryInterface.sequelize.query(
      `UPDATE "users" SET "isActive" = true WHERE "isActive" = false;`,
    );
  },

  async down(queryInterface, Sequelize) {
    // Rollback: có thể set lại false nếu cần
    // Nhưng thường không cần rollback cho việc này
  },
};
