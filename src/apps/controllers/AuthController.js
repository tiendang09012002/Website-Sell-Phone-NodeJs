const userModel = require('../models/user')
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const generateRememberToken = () => {
    return crypto.randomBytes(64).toString('hex');
}

const login = (req, res) => {
    res.render('admin/login', { data: {} })
}


const postLogin = async (req, res) => {
    const error = "Tài khoản không hợp lệ !"
    const user = await userModel.findOne({ email: req.body.email, provider:"local" });
    
    if (!user)
        return res.render('admin/login', { data: { error } })

    const isValidPassword = await bcrypt.compare(req.body.password, user.password)
    if (!isValidPassword)
        return res.render('admin/login', { data: { error } })

    req.session.user = user


    res.redirect('/admin/dashboard');
}

const logout = (req, res) => {
    req.session.destroy();
     
    res.redirect('/admin/login');
}

module.exports = {
    login, logout, postLogin, generateRememberToken
}
