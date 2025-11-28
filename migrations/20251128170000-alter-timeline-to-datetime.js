'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Add a new temporary column with DATE type
    await queryInterface.addColumn('order_journeys', 'timeline_new', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Step 2: Copy data from old column to new column (convert TIME to DATE)
    // For existing TIME values, we'll combine with current date
    await queryInterface.sequelize.query(`
      UPDATE order_journeys 
      SET timeline_new = CASE 
        WHEN timeline IS NOT NULL THEN 
          (CURRENT_DATE + timeline::time)::timestamp
        ELSE NULL
      END
    `);

    // Step 3: Drop the old column
    await queryInterface.removeColumn('order_journeys', 'timeline');

    // Step 4: Rename the new column to the original name
    await queryInterface.renameColumn(
      'order_journeys',
      'timeline_new',
      'timeline',
    );
  },

  async down(queryInterface, Sequelize) {
    // Step 1: Add a new temporary column with TIME type
    await queryInterface.addColumn('order_journeys', 'timeline_old', {
      type: Sequelize.TIME,
      allowNull: true,
    });

    // Step 2: Copy data from DATE column to TIME column (extract time part)
    await queryInterface.sequelize.query(`
      UPDATE order_journeys 
      SET timeline_old = CASE 
        WHEN timeline IS NOT NULL THEN 
          timeline::time
        ELSE NULL
      END
    `);

    // Step 3: Drop the DATE column
    await queryInterface.removeColumn('order_journeys', 'timeline');

    // Step 4: Rename the TIME column to the original name
    await queryInterface.renameColumn(
      'order_journeys',
      'timeline_old',
      'timeline',
    );
  },
};
