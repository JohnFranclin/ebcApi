const db = require('./db');
const helper = require('./helper');

async function getChatMessages(page = 0) {
    const offset = page * 50;
    if (!Number.isInteger(offset)) {
        return Promise.reject(new Error("False page number."))
    }

    const rows = await db.query(`SELECT id, msg_time, msg_type, client_id, client_name, msg 
                                FROM chatlog_28950 
                                WHERE msg NOT LIKE '!%' 
                                ORDER BY id DESC LIMIT ${offset}, 200`);
    return helper.emptyOrRows(rows);
}

async function getChatByMessagesId(id = 1) {
    const start_id = id + 100;
    const rows = await db.query(`SELECT id, msg_time, msg_type, client_id, client_name, msg 
                                FROM chatlog_28950 
                                WHERE id <= ?
                                AND msg NOT LIKE '!%' 
                                ORDER BY id DESC LIMIT 200`, [start_id]);
    return helper.emptyOrRows(rows);
}

async function getCallAdminLog(page = 0) {
    const offset = page * 100;
    if (!Number.isInteger(offset)) {
        return Promise.reject(new Error("False page number."))
    }

    const rows = await db.query(`SELECT admin_id, admin_name, data, cmd_time 
                                FROM cmdlog_28950 
                                WHERE command = "calladmin" 
                                ORDER BY id DESC 
                                LIMIT ${offset}, 100`);
    return helper.emptyOrRows(rows);
}



module.exports = {
    getChatMessages,
    getChatByMessagesId,
    getCallAdminLog
}