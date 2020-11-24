/**
 * @Author: maple
 * @Date: 2020-09-18 18:23:15
 * @LastEditors: maple
 * @LastEditTime: 2020-11-24 17:24:14
 */
const DDNS = require('wm-ddns').AsyncDomain;

const { email, password, domain, _record, loginId, loginToken } = require('./config.json');

const d = new DDNS(email, password, domain, {
  loginId: loginId,
  loginToken: loginToken
});

// let r;
let value;

async function sleep (time) {
  return new Promise(function (resolve) {
    setTimeout(() => {
      resolve();
    }, time * 1000);
  });
}

async function main () {
  const recordDatas = [].concat(_record);
  const records = [];
  let errStatus = false;
  for (const recordData of recordDatas) {
    try {
      records.push(await d.recordByNameAsync(recordData));
    } catch (err) {
      errStatus = true;
      console.error(err);
    }
  }

  if (!records.length) {
    await sleep(60);
    process.exit(1);
  }

  if (errStatus) {
    setTimeout(() => {
      process.exit(0); // 30 分钟自动重启
    }, 60 * 30 * 1000);
  }

  while (true) {
    for (const record of records) {
      const oldIP = record.value;
      await record.ddnsAsync();
      if (oldIP !== record.value) {
        console.log(record.name + ' ip 已经更换');
      } else {
        console.log(record.name + ' ip 未更换');
      }
    }
    await sleep(60);
  }
}

main();
