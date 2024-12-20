exports.up = function(knex) {
    return knex.schema
        .createTable('profiles', function(table) {
            table.string('id').primary();
            table.string('email').notNullable().unique();
            table.string('name');
            table.string('password_hash');
            table.string('profile_picture_url');
            table.text('bio');
            table.string('oauth_provider');
            table.timestamps(true, true);
            table.timestamp('last_login');
        })
        .createTable('projects', function(table) {
            table.increments('id').primary();
            table.string('profile_id').references('id').inTable('profiles').onDelete('CASCADE');
            table.string('name').notNullable();
            table.text('description');
            table.timestamps(true, true);
        })
        .createTable('posts', function(table) {
            table.increments('id').primary();
            table.string('profile_id').references('id').inTable('profiles').onDelete('CASCADE');
            table.integer('project_id').references('id').inTable('projects').onDelete('CASCADE');
            table.string('title').notNullable();
            table.text('content');
            table.integer('post_index');
            table.integer('streak_day');
            table.timestamps(true, true);
        })
        .createTable('media', function(table) {
            table.increments('id').primary();
            table.integer('post_id').references('id').inTable('posts').onDelete('CASCADE');
            table.string('url');
            table.string('type');
            table.string('filename');
            table.timestamps(true, true);
        })
        .createTable('social_links', function(table) {
            table.increments('id').primary();
            table.string('profile_id').references('id').inTable('profiles').onDelete('CASCADE');
            table.string('platform');
            table.string('url');
            table.timestamps(true, true);
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('social_links')
        .dropTable('media')
        .dropTable('posts')
        .dropTable('projects')
        .dropTable('profiles');
};
