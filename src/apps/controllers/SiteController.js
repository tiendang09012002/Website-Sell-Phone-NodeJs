const productModel = require('../models/product')
const categoryModel = require('../models/category')
const commentModel = require('../models/comment')
const keywordModel = require('../models/keyword')
const orderModel = require('../models/order')
const userModel = require('../models/user')
const customerModel = require('../models/customer')
const bcrypt = require('bcrypt');

const crypto = require('crypto');
const generateRememberToken = () => {
    return crypto.randomBytes(64).toString('hex');
}

const moment = require('moment')
const ejs = require('ejs')
const pagination = require('../../common/pagination')
const { formatter } = require('../../lib/index')
const transporter = require('../../common/tranporter.js')
const path = require('path')
const customer = require('../models/customer')




const register = async (req, res) => {
    res.render('site/register', { data: {} })
}
const postregister = async (req, res) => {
    const error = "Tài khoản đã tồn tại!"
    const user = await customerModel.findOne({ email: req.body.email })
    if (user)
        return res.render('site/register', { data: { error } })
    if (req.body.password !== req.body.repassword)
        return res.render('site/register', { data: { error: "mật khẩu phải trùng nhau" } })
    const hashPassword = await bcrypt.hash(req.body.password, 10)
    await new customerModel({
        ...req.body,
        password: hashPassword
    }).save()
    return res.redirect('/user/login',)

}

const login = async (req, res) => {
   
    res.render('site/login', {data:{}})
}
const postLogin = async (req, res) => {
    const error = "Tài khoản không hợp lệ !";
    
    try {
        const user = await customerModel.findOne({ email: req.body.email, provider: "local" });
        
        if (!user)
            return res.render('site/login', { data: { error } });

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword)
            return res.render('site/login', { data: { error } });

        req.session.user =user;
     
       

        res.redirect('/');
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error in postLogin:", error);
        return res.render('site/login', { data: { error: "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau." } });
    }
};


const logout = (req, res) => {
    req.session.destroy();
    res.clearCookie('remember_cus');  
    res.clearCookie('customer_name'); 
    res.redirect('/');
}

const home = async (req, res) => {
    const productsFeartured = await productModel.find({ featured: true }).limit(6);
    const products = await productModel.find({}).sort({ _id: -1 }).limit(6);
   
  
   
    res.render("site/index", { products, productsFeartured});
}
const category = async (req, res) => {
    const totalRow = await productModel.find({ cat_id: req.params.id }).countDocuments()
    const limit = parseInt(req.query.limit) || 10
    const currentPage = parseInt(req.query.page) || 1
    const skip = (currentPage - 1) * limit
    const pages = pagination(currentPage, limit, totalRow);
    const totalPages = Math.ceil(totalRow / limit)
    const category = await categoryModel.findById(req.params.id)
    const products = await productModel.find({ cat_id: req.params.id })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
    res.render("site/category", { products, total: totalRow, currentPage, totalPages, pages, category, customer: req.session.customer });
}
const product = async (req, res) => {
    const keyword = (await keywordModel.find()).map(item => item.keyword)
    const totalRow = await commentModel.find({ prd_id: req.params.id, active: true }).sort({ _id: -1 }).countDocuments()
    const limit = parseInt(req.query.limit) || 4
    const currentPage = parseInt(req.query.page) || 1
    const skip = (currentPage - 1) * limit
    const pages = pagination(currentPage, limit, totalRow);
    const totalPages = Math.ceil(totalRow / limit)
    const product = await productModel.findById(req.params.id)
    let comments = await commentModel.find({ prd_id: req.params.id, active: true })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
    comments = comments.map((item) => {
        item.body = item.body.replace(new RegExp(keyword.join('|'), 'gi'), (match) => '*'.repeat(match.length))
        return item
    })
    res.render("site/product", { product, comments, moment, currentPage, totalPages, pages });
}
const createComment = async (req, res) => {
    if (!req.body.full_name || !req.body.email || !req.body.body) {
        return res.redirect(req.path)
    }
    // const keyword = (await keywordModel.find()).map(item=> item.keyword) // Danh sách từ khóa nhạy cảm
    // const newComment = req.body.body.replace(new RegExp(keyword.join('|'), 'gi'), (match) => '*'.repeat(match.length));
    const comment = new commentModel({ ...req.body, body: req.body.body, prd_id: req.params.id })
    await comment.save()
    res.redirect(req.path)
}
const search = async (req, res) => {
    const keyword = req.query.keyword || ""
    const totalRow = await productModel.find({ $text: { $search: keyword } }).countDocuments()
    const limit = parseInt(req.query.limit) || 10
    const currentPage = parseInt(req.query.page) || 1
    const skip = (currentPage - 1) * limit
    const pages = pagination(currentPage, limit, totalRow);
    const totalPages = Math.ceil(totalRow / limit)
    const products = await productModel.find({ $text: { $search: keyword } })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
    res.render("site/search", {customer: req.session.customer, products, keyword, currentPage, totalPages, pages });
}
const searchSuggestions = async (req, res) => {
    try {
        const keyword = req.query.keyword.trim();
        
        // Sử dụng biểu thức chính quy để tìm kiếm tên sản phẩm chứa keyword
        const products = await productModel.find({ name: { $regex: keyword, $options: 'i' } }).limit(5); // Tìm kiếm không phân biệt chữ hoa chữ thường và giới hạn 5 kết quả

        res.json(products); // Trả về sản phẩm gợi ý dưới dạng JSON
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const cart = (req, res) => {
    const items = req.session.cart
    res.render("site/cart", { customer: req.session.customer,items, formatter });
}
const success = (req, res) => {
    res.render("site/success");
}

const addToCart = async (req, res) => {
    const product = await productModel.findById(req.body.id)
    let ktra = false;
    let items = req.session.cart
    items = items.map((item) => {
        if (item._id === req.body.id) {
            ktra = true;
            item.qty += parseInt(req.body.qty)
        }
        return item
    })
    if (!ktra) {
        items.push({
            _id: req.body.id,
            qty: parseInt(req.body.qty),
            thumbnail: product.thumbnail,
            price: product.price,
            name: product.name
        })
    }
    req.session.cart = items
    res.redirect("/cart")
}
const updateItemCart = (req, res) => {
    const { products } = req.body

    req.session.cart = req.session.cart.map((item) => {
        item.qty = Number(products[item._id].qty)
        return item
    })
    res.redirect("/cart")
}

const deleteItemCart = (req, res) => {
    req.session.cart = req.session.cart.filter((item) => item._id != req.params.id)
    res.redirect("/cart")
}
const order = async (req, res) => {
    const view_folder = req.app.get("views")
    const order = new orderModel({ ...req.body, customer: req.session.user._id })
    order.items = []
    req.session.cart.forEach((item) => {
        order.items.push({ product: item._id, quantity: item.qty })
    })
    await order.save()

    const html = await ejs.renderFile(path.join(view_folder, "site/email.ejs"), { ...req.body, items: req.session.cart, formatter })

    await transporter.sendMail({
        from: '"VietPro Store 👻" <phamquyduong2k2@gmail.com>', // sender address
        to: req.session.user.email, // list of receivers
        subject: "Xác nhận đơn hàng từ VietPro Store ✔", // Subject line
        html, // html body
    });
    req.session.cart = []
    res.redirect("/success")

}

const forgotPassword = async (req, res) => {
    res.render("site/forgot-password", { data: {} });
}

const postForgotPassword = async (req, res) => {
    const { email } = req.body;
    var newPassword = Math.random().toString(36).slice(-6);
    const customer = await customerModel.findOne({ email: email });
    req.session.newPassword = newPassword
    if (!customer) {
        res.render("site/forgot-password", { data: { error: "Email không tồn tại" } });
        return;
    }

    await transporter.sendMail({
        from: '"VietPro Store 👻" tiendang09012002@gmail.com',
        to: email,
        subject: "Xác nhận mật khẩu mới VietPro Store",
        html: `Nhấp vào kích hoạt để kích hoạt mật khẩu <form action="http://localhost:3000/active-password" method="post">
                ${newPassword}
                <input value="${email}" style="display: none" name="email" type="text">
                <input value="${new Date()}" style="display: none" name="dateSend" type="text">
                <input value="${newPassword}" style="display: none" name="newPassword" type="text">
                <button type="submit" class="btn btn-primary btn-block">Kích hoạt</button>
            </form>`
    });

    // setTimeout(async () => {
    //     console.log(1);
    //     const customer = await CustomerModel.findOne({ email: email });
    //     const checkPassword = await bcrypt.compare (newPassword, customer.password)
    //     console.log(checkPassword);
    //     if (customer && !checkPassword) {
    //         newPassword = null;
    //         console.log(newPassword);
    //         res.send();
    //         return 
    //     }
    // }, 20000);
    
    res.redirect("user/login");
}

const activePassword = async (req, res) => {
    
    // const email = req.session.email
    // const password = req.session.newPassword
    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(password);
    // if(password === null){
    //     res.render('site/login', { data: {error: "Password vô hiệu hoá"} })
    //     return
    // }
    // await CustomerModel.updateOne({ email: email }, { password: hashedPassword });
    // req.session.destroy();
    
    const {email, newPassword, dateSend} = req.body
    if(!req.session.newPassword){
        return res.json({error: "404"});
    }
    if(req.session.newPassword !== newPassword){
        return res.json({error: "404"});
    }
    const timeNow = new Date()
    if(timeNow.getTime() - (new Date(dateSend)).getTime()>= 30000){
        res.render('site/login', { data: {error: "Password vô hiệu hoá"} })
        return
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await customerModel.updateOne({ email: email }, { password: hashedPassword });
    res.redirect("user/login");
}


module.exports = {
    home, category, product, search, cart, success,
    createComment, addToCart, updateItemCart, deleteItemCart, order, login, postLogin, logout, register
    , postregister, searchSuggestions, forgotPassword, postForgotPassword, activePassword, generateRememberToken,
}
