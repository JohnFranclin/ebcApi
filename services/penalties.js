const db = require('./db');
const helper = require('./helper');

async function getAllPenalties(page = 0) {
    const offset = page * 50;
    if (!Number.isInteger(offset)) {
        return Promise.reject(new Error("False page number."))
    }

    const rows = await db.query(`SELECT p.type, p.duration, p.reason, p.time_add, p.client_id, c.name, p.admin_id, 
                                CASE 
                                    WHEN c1.name is null THEN "eBc|System" 
                                    ELSE c1.name 
                                END AS admin_name 
                                FROM penalties AS p 
                                LEFT JOIN clients AS c ON p.client_id = c.id 
                                LEFT JOIN clients AS c1 ON p.admin_id = c1.id 
                                ORDER BY p.time_add DESC 
                                LIMIT ${offset}, 50`);
    return helper.emptyOrRows(rows);
}

async function getPenaltiesByType(type = "", page = 0) {
    const offset = page * 50;
    if (!Number.isInteger(offset)) {
        return Promise.reject(new Error("False page number."))
    }

    const rows = await db.query(`SELECT p.type, p.duration, p.reason, p.time_add, p.client_id, c.name, p.admin_id, 
                                CASE 
                                    WHEN c1.name is null THEN "eBc|System" 
                                    ELSE c1.name 
                                END AS admin_name 
                                FROM penalties AS p 
                                LEFT JOIN clients AS c ON p.client_id = c.id 
                                LEFT JOIN clients AS c1 ON p.admin_id = c1.id 
                                WHERE p.type = ?
                                ORDER BY p.time_add DESC 
                                LIMIT ${offset}, 50`, [type]);
    return helper.emptyOrRows(rows);
}

async function getPenaltiesByIp(ip = "") {
    const rows = await db.query(`SELECT penalties.id AS PenaltyID, type, reason, penalties.time_add, clients.ip, clients.id AS ClientID, clients.name, clients.guid
                        FROM penalties
                        JOIN clients ON clients.id = penalties.client_id
                        WHERE client_id IN ( SELECT clients.id from clients WHERE clients.ip LIKE ${ip + "%"} ) 
                        AND penalties.type IN ("Ban","TempBan")
                        ORDER BY client_id DESC LIMIT 100`);
    return helper.emptyOrRows(rows);
}

async function getTotalPenaltiesPerMember() {
    const rows = await db.query(`SELECT clients.name, COUNT(penalties.id) AS penalty_count, admin_id
                                FROM penalties 
                                JOIN clients ON clients.id = admin_id
                                WHERE clients.group_bits > 2
                                AND penalties.admin_id != 1
                                GROUP BY admin_id
                                ORDER BY COUNT(penalties.id) DESC`);
    return helper.emptyOrRows(rows);
}

async function getPenaltiesPerMemberLastMonth() {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const oneMonthAgo = monthAgo.getTime() / 1000;
    const rows = await db.query(`SELECT clients.name, COUNT(penalties.id) AS penalty_count, admin_id
                                FROM penalties 
                                JOIN clients ON clients.id = admin_id
                                WHERE clients.group_bits > 2
                                AND penalties.admin_id != 1
                                AND penalties.time_add >= ?
                                GROUP BY admin_id
                                ORDER BY COUNT(penalties.id) DESC`, [oneMonthAgo]);
    return helper.emptyOrRows(rows);
}

module.exports = {
    getAllPenalties,
    getPenaltiesByType,
    getPenaltiesByIp,
    getTotalPenaltiesPerMember,
    getPenaltiesPerMemberLastMonth
}