const Knex = require('knex');

/**
 * @param {Knex} knex
 */
exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable('users', function (table) {
            table.increments("id");
            table.string("login", 32).unique().notNullable();
            table.string("name", 64);
        })
    ]);
};

/**
 * @param {Knex} knex
 */
exports.down = function (knex) {
    return Promise.all([
        knex.schema.dropTable("users")
    ]);
};