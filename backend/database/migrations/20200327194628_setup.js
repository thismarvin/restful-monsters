const Knex = require('knex');

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    await Promise.all([
        knex.schema.createTable('users', (table) => {
            table.increments("id").notNullable();
            table.string("login", 32).unique().notNullable();
            table.string("name", 64);
        }),
        knex.schema.createTable('levels', (table) => {
            table.increments("id").notNullable();
            table.string("name", 32).notNullable();
            table.string("description", 64).notNullable();
            table.integer("play_count").unsigned().defaultTo(0);
            table.integer("completed_count").unsigned().defaultTo(0);
            table.integer("likes").unsigned().defaultTo(0);
            table.integer("dislikes").unsigned().defaultTo(0);
            table.date("date_created").notNullable();
        })
    ]);

    await Promise.all([
        knex.schema.createTable('level_data', (table) => {
            table.integer("level_id").unsigned().references("id").inTable("levels").onDelete("cascade");
            table.string("block_data", 2048).notNullable();
        }),
        knex.schema.createTable('user_levels', (table) => {
            table.integer("user_id").unsigned().references("id").inTable("users").onDelete("cascade");
            table.integer("level_id").unsigned().references("id").inTable("levels").onDelete("cascade");
        })
    ]);
};

/**
 * @param {Knex} knex
 */
exports.down = async (knex) => {
    await Promise.all([
        knex.schema.dropTable("users"),
        knex.schema.dropTable("levels"),
        knex.schema.dropTable("level_data"),
        knex.schema.dropTable("user_levels")
    ]);
};