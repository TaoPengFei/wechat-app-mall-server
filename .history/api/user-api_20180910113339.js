const moment = require('moment')
const mongoose = require('../mongoose')
const marked = require('marked')
const request = require('request');
const config = require('../config')
const User = mongoose.model('User')

/**
 * 微信根据code回去用户openId
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getWxUser = (req, res) => {
    const { code } = req.query
    let urlStr = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + config.AppID + '&secret=' + config.Secret + '&js_code=' + code + '&grant_type=authorization_code';
    request(urlStr, (error, response, body)=>{
        if (!error && response.statusCode == 200) {
            return User.createAsync({
                openid:body.openid,
                creat_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            }).then(result => {
                res.json({
                    code: 200,
                    message: '获取成功',
                    data: JSON.parse(body)
                })
            })
        }else{
            res.json({
                code: -200,
                data: error
            })
        }
    })
}
