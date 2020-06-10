const phone = (v) => /^[1](([3|5|8][\d])|([4][4,5,6,7,8,9])|([6][2,5,6,7])|([7][^9])|([9][1,8,9]))[\d]{8}$/.test(v)||'请输入正确的手机号'
const name = (v) => /^[\u4E00-\u9FA5]{2,4}$/.test(v)||'用户名为2到4个中文'
const role = (v) => v&&v.length>0||"请选择角色"
const password = (v) => /^(\w){6,20}$/.test(v)||'密码只能输入6-20个字母、数字、下划线'
const fontLimit = (v) =>  v.length <= 50||'最多50字'
const code = (v) => /^[0-9]{6}$/.test(v)||'请输入正确的验证码'
const answer = (v) => v!=null&&v.length<10||"请输入10个字以内的答案"
const question = (v) => v!=null||"请选择密保问题"
const isNumber = (v) => /^[+]?\d{1,2}$/.test(v)||"请输100以下的正整数"
const bankCard =(v) =>/^([1-9]{1})(\d{14}|\d{18})$/.test(v)||'请输入正确的银行卡号'
const number =(v)=>/^[1-9]\d*$/.test(v)||'请输入正整数'
const roleKey = (v) => v!=null||'请输入角色Key'
const roleName = (v) => v!=null||'请输入角色名'

export default {
    phone,
    name,
    role,
    password,
    fontLimit,
    code,
    answer,
    question,
    isNumber,
    bankCard,
    number,
    roleKey,
    roleName,
}