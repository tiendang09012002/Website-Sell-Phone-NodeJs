const checkAdmin=(req,res,next) => {
    if(req.session.user&&req.session.user.role){
        next();
    }else{
        res.redirect('/admin/login')
    }
}
const checkLogin=(req,res,next) => {
    if(req.session.user&&req.session.user.role){
        res.redirect('/admin/dashboard')
    }else{
        next();
    }
}
const checkCustomer=(req,res,next) => {
    if(req.session.user&&!req.session.user.role){
        next();
    }else{
        res.redirect('/user/login')
    }
}
const checkLoginCustomer=(req,res,next) => {
    if(req.session.user){
        res.redirect('/')
    }else{
        next();
    }
}
module.exports={checkAdmin,checkLogin,checkCustomer,checkLoginCustomer}