const checkEmail = (req, res, next) => {
    const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(reg.test(req.body.email)){
        next();
    }else{
        res.render('admin/users/add_user',{user:{
            ...req.body,
            message:"Email không hợp lệ !"
        }})
    }
}
const checkRePassword = (req, res,next) => {
    if(req.body.password===req.body.re_password){
        next();
    }else{
        res.render('admin/users/add_user',{user:{
            ...req.body,
            message:"Mật khẩu không khớp !"
        }})
    }
}

module.exports={
    checkEmail,
    checkRePassword
}