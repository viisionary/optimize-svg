const MD5 = require("./md5");
const axios = require("axios");
let appid = ''
let key = ''
const setId = (ops) => {
    appid = ops.appid;
    key = ops.key;
}
const translate = (query) => {
    console.log(appid, key)
    const salt = (new Date).getTime();
    const from = "zh";
    const to = "en";
    const str1 = appid + query + salt + key;
    const sign = MD5(str1);
    return new Promise((resolve, reject) => axios("http://api.fanyi.baidu.com/api/trans/vip/translate", {
        params: {
            q: query,
            appid: appid,
            salt: salt,
            from: from,
            to: to,
            sign: sign
        }
    }).then(({data}) => {
        if (data.error_msg) {
            console.log(data)
            reject(data.error_msg);
        }
        if (data.trans_result) {
            resolve(data.trans_result[0].dst);
        }
    }));
};
module.exports = {
    translate,
    setId
}