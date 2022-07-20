const db = require('./db');
const helper = require('./helper');

async function getOverview(id = 2) {
    const rows = await db.query('SELECT c.name, c.ip, c.connections, c.group_bits, c.guid, c.time_add, c.time_edit,\
                                     g.name AS "group"\
                                     FROM clients c\
                                     JOIN `groups` g ON g.id = c.group_bits\
                                     WHERE c.id = ?', [id]);
    return helper.emptyOrRows(rows);
}

async function getPlaytimeInSeconds(guid = 2) {
    const rows = await db.query(`SELECT SUM(gone - came) AS playtime_seconds
                                     FROM ctime
                                     WHERE guid = ?`, [guid]);
    return helper.emptyOrRows(rows);
}

async function getPrestigeAndAwards(guid = 2) {
    const rows = await db.query(`SELECT winterprestige, summerprestige, award_tier, donation_tier 
                               FROM player_core 
                               WHERE guid = ?`, [guid]);
    return helper.emptyOrRows(rows);
}

async function getStats(id = 2) {
    const rows = await db.query(`SELECT kills, deaths, total_kills, ratio, skill, rounds 
                                FROM xlr_playerstats 
                                WHERE client_id = ?`, [id]);
    return helper.emptyOrRows(rows);
}

async function getPenaltyStats(id = 2) {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const oneMonthAgo = monthAgo.valueOf();
    const rows = await db.query(`SELECT
                                    (SELECT COUNT(id) FROM penalties WHERE admin_id = ?) 
                                    AS total,
                                    (SELECT COUNT(id) FROM penalties WHERE admin_id = ? AND time_add >= ${oneMonthAgo}) 
                                    AS lastMonth`, [id, id]);
    return helper.emptyOrRows(rows);
}

async function getAliases(id = 2) {
    const rows = await db.query(`SELECT alias FROM aliases WHERE client_id = ? ORDER BY time_add DESC`, [id]);
    return helper.emptyOrRows(rows);
}

async function getPenalties(id = 2) {
    const rows = await db.query(`SELECT p.type, p.duration, p.reason, p.time_add, c.name AS admin_name,
                                p.admin_id, p.time_expire, p.inactive
                                FROM penalties AS p 
                                JOIN clients AS c 
                                WHERE p.admin_id = c.id 
                                AND p.client_id = ? 
                                ORDER BY time_add DESC`, [id]);
    return helper.emptyOrRows(rows);
}

async function getChatlog(id = 2, page = 0) {
    const offset = page * 50;
    if (!Number.isInteger(offset)) {
        return Promise.reject(new Error("False page number."));
    }

    const rows = await db.query(`SELECT id, msg_time, msg_type, client_name, msg 
                                FROM chatlog_28950 
                                WHERE client_id = ?  
                                AND msg NOT LIKE '!%' 
                                ORDER BY msg_time DESC 
                                LIMIT ${offset}, 50`, [id]);
    return helper.emptyOrRows(rows);
}

async function getPrestigeLog(guid = 2) {
    const rows = await db.query(`SELECT * FROM prestige_log WHERE guid = ? ORDER BY id ASC`, [guid]);

    rows.forEach(row => {
        row.time = (new Date(row.time)).getTime() / 1000;
    })

    return helper.emptyOrRows(rows);
}

async function getIpAliases(id = 2) {
    const rows = await db.query(`SELECT num_used, ip, time_add, time_edit 
                                FROM ipaliases 
                                WHERE client_id = ? 
                                ORDER BY time_edit DESC`, [id]);
    return helper.emptyOrRows(rows);
}

async function getCmdLog(id = 2) {
    const rows = await db.query(`SELECT * FROM cmdlog_28950 WHERE admin_id = ? ORDER BY id DESC LIMIT 500`, [id]);
    return helper.emptyOrRows(rows);
}

module.exports = {
    getOverview,
    getPlaytimeInSeconds,
    getPrestigeAndAwards,
    getStats,
    getPenaltyStats,
    getAliases,
    getPenalties,
    getChatlog,
    getPrestigeLog,
    getIpAliases,
    getCmdLog
}