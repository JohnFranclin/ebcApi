const db = require('./db');
const helper = require('./helper');

async function getClientsByString(searchString = "", page = 0) {
    const offset = page * 50;
    if (!Number.isInteger(offset)) {
        return Promise.reject(new Error("False page number."))
    }

    const rows = await db.query(`SELECT id, name, time_edit, ip 
                                FROM clients 
                                WHERE name LIKE CONCAT('%', ?, '%') 
                                ORDER BY time_edit DESC 
                                LIMIT ${offset}, 50`, [searchString]);
    return helper.emptyOrRows(rows);
}

async function getClientsByAlias(searchString = "", page = 0) {
    const offset = page * 50;
    if (!Number.isInteger(offset)) {
        return Promise.reject(new Error("False page number."))
    }

    const rows = await db.query(`SELECT a.client_id AS id, a.alias AS name, a.time_edit, c.ip 
                                FROM aliases AS a
                                JOIN clients AS c ON c.id = a.client_id
                                WHERE alias LIKE CONCAT('%', ?, '%') 
                                ORDER BY a.time_edit DESC, c.time_edit DESC 
                                LIMIT ${offset}, 50`, [searchString]);
    return helper.emptyOrRows(rows);
}

async function getClientsByGuid(guid = "2", page = 0) {
    const offset = page * 50;
    if (!Number.isInteger(offset)) {
        return Promise.reject(new Error("False page number."))
    }

    const rows = await db.query(`SELECT id, guid, name, time_edit, ip 
                                FROM clients 
                                WHERE guid LIKE CONCAT(?, '%') 
                                ORDER BY time_edit DESC 
                                LIMIT ${offset}, 50`, [guid]);
    return helper.emptyOrRows(rows);
}

async function getClientById(id = 2) {
    const rows = await db.query(`SELECT id, name, time_edit, ip 
                                FROM clients 
                                WHERE id = ?`, [id]);
    return helper.emptyOrRows(rows);
}

module.exports = {
    getClientsByString,
    getClientsByAlias,
    getClientsByGuid,
    getClientById
}