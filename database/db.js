const { Pool } = require('pg');

const pool = new Pool({
    user: 'Luis',
    host: 'localhost',
    database: 'nodedb',
    password: 'Luis9090',
    port: 5432,
});

module.exports = pool;
