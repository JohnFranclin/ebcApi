const db = require('./db');
const helper = require('./helper');

async function getPromodSvars() {
    const rows = await db.query(`SELECT * FROM current_svars_28950`);

    let data = {}
    rows.forEach(row => {
       data[row.name] = row.value;
    });

    return helper.emptyOrRows(data);
}

async function getPromodPlayers() {
    const rows = await db.query(`SELECT * FROM current_clients_28950`);
    return helper.emptyOrRows(rows);
}

module.exports = {
    getPromodSvars,
    getPromodPlayers
}