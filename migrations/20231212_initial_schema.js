exports.up = function(knex) {
    return knex.schema
        .createTable('users', function(table) {
            table.string('id').primary();
            table.string('email').notNullable().unique();
            table.string('name');
            table.timestamps(true, true);
        })
        .createTable('logs', function(table) {
            table.increments('id').primary();
            table.string('user_id').references('id').inTable('users');
            table.string('title').notNullable();
            table.text('content');
            table.timestamps(true, true);
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('logs')
        .dropTable('users');
};
