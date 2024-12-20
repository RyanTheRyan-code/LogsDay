exports.up = function(knex) {
    return knex.schema
        .createTable('profiles', function(table) {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.string('name');
            table.string('email').notNullable();
            table.string('password_hash');
            table.text('bio');
            table.string('profile_picture_url');
            table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
            table.timestamp('last_login', { useTz: true });
            table.boolean('is_google_user').defaultTo(false);
            table.string('google_id');
        })
        .createTable('projects', function(table) {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('profile_id').references('id').inTable('profiles');
            table.string('name').notNullable();
            table.text('description');
            table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
            table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
        })
        .createTable('posts', function(table) {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('profile_id').references('id').inTable('profiles');
            table.uuid('project_id').notNullable().references('id').inTable('projects');
            table.string('title').notNullable();
            table.text('content');
            table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
            table.integer('streak_day');
            table.string('chapter');
            table.specificType('location', 'point');
            table.boolean('is_published').defaultTo(true);
            table.integer('post_index');
        })
        .createTable('media', function(table) {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('post_id').references('id').inTable('posts');
            table.string('type').notNullable();
            table.string('url').notNullable();
            table.string('filename');
            table.integer('size_bytes');
            table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
            table.string('mimetype');
        })
        .createTable('social_links', function(table) {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('profile_id').references('id').inTable('profiles');
            table.string('platform').notNullable();
            table.string('url').notNullable();
            table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        })
        .createTable('comments', function(table) {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('post_id').references('id').inTable('posts');
            table.uuid('profile_id').references('id').inTable('profiles');
            table.text('content').notNullable();
            table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
            table.boolean('is_edited').defaultTo(false);
        })
        .createTable('followers', function(table) {
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
            table.uuid('follower_id').references('id').inTable('profiles');
            table.uuid('following_id').references('id').inTable('profiles');
            table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('followers')
        .dropTable('comments')
        .dropTable('social_links')
        .dropTable('media')
        .dropTable('posts')
        .dropTable('projects')
        .dropTable('profiles');
};
