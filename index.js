const DDNS = require('wm-ddns').AsyncDomain;
const request = require('request-promise');
const debug = require('debug')('ddns-plus:ddns');

const { email, password, domain, record, loginId, loginToken } = require('./config.json');

const d = new DDNS(email, password, domain, { 
    loginId: loginId,
    loginToken: loginToken
 });

let r;
let value;

setInterval(async () => {
    if (!r) {
        try {
            r = await d.recordByNameAsync(record);
        } catch(err) {
            console.log('获取 record 失败');
            console.error(err);
        }
    }
    try {
        await r.ddnsAsync();
    } catch(err) {
        console.log('更新 ddns 失败');
        console.error(err);
    }

    if (value !== r.value) {
        console.log('更新 ddns 成功: ' + r.value);
        value = r.value;
    }

}, 1000 * 60);
