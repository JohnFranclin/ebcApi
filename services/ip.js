const db = require('./db');
const helper = require('./helper');

async function getIpInfo(ip = '8.8.8.8') {
    const data = (await fetch(`http://ip-api.com/json/${ip}?fields=16967679`)).json();

    if (data.status === 'fail') {
        return Promise.reject(new Error('Failed to fetch data from Ip api. ' + data.message));
    }

    return helper.emptyOrRows(data);
}

async function getIpBatchInfo(ips = ['8.8.8.8', '24.48.0.1']) {
    if (ips.length > 100) {
        ips = ips.slice(0, 100);
    }

    const data = (await fetch('http://ip-api.com/batch', {
        method: 'POST', body: JSON.stringify(ips)
    })).json();

    return helper.emptyOrRows(data);
}

/* test if string is ipv4 formatted */
function isIp(ip = '') {
    const regEx = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
    return regEx.test(ip);
}

// Converts numeric degrees to radians
function toRad(Value)
{
    return Value * Math.PI / 180;
}

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat1, lon1, lat2, lon2)
{
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

async function getSimilarIps(ip = '8.8.8.8') {
    if (!isIp(ip)) {
        return Promise.reject(new Error('Not a valid ip.'));
    }

    const reqIpData = await helper.emptyOrRows((await fetch(`http://ip-api.com/json/${ip}?fields=16967679`)).json());
    if (!reqIpData) {
        return Promise.reject('Could not retrieve information about this IP.');
    }

    const queryIp = ip.split('.').slice(0, 2).join('.') + '%';
    const rows = await db.query(`SELECT id, name, ip, time_edit
                                FROM clients 
                                WHERE ip LIKE ?
                                AND ip NOT LIKE ?
                                ORDER BY time_edit DESC
                                LIMIT 99;`, [queryIp, ip]);

    if (!rows) {
        return {
            query: reqIpData,
            result: []
        };
    }

    const ips = rows.map(row => row.ip);

    const ipApiData = await helper.emptyOrRows((await fetch('http://ip-api.com/batch?fields=192511', {
        method: 'POST', body: JSON.stringify(ips)
    })).json());

    const data = ipApiData.map((e, index) => {
       if (e.status === 'fail') return {
           status: 'fail',
           ip: e.query,
           distance: -1,
           isp: '',
           country: '',
           regionName: '',
           city: '',
           proxy: false,
           client_id: rows[index].id,
           client_name: rows[index].name
       };
       const distanceKm = calcCrow(reqIpData.lat, reqIpData.lon, e.lat, e.lon).toFixed(1);
       return {
           status: 'success',
           ip: e.query,
           distance: distanceKm,
           isp: e.isp,
           country: e.country,
           regionName: e.regionName,
           city: e.city,
           proxy: e.proxy,
           client_id: rows[index].id,
           client_name: rows[index].name
       };
    });

    return {
        query: reqIpData,
        result: data
    };
}

module.exports = {
    getIpInfo, getIpBatchInfo, getSimilarIps
}