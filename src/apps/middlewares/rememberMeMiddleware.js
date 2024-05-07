const crypto = require('crypto');
const userModel = require('../models/user');
const customerModel =  require('../models/customer');


const checkRememberCusToken = async (req, res, next) => {
   
    const rememberCustomer=req.cookies.customer_name;

  
    if (rememberCustomer) {
        try {
            // Tìm người dùng dựa trên mã thông báo "Ghi nhớ tôi"
            
            const user = await customerModel.find({ _id: rememberCustomer});
            req.session.user = user;
            console.log("aa", user);
            if (user) {
              
                return res.redirect('/');
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Lỗi khi tìm kiếm người dùng theo mã thông báo 'Ghi nhớ tôi':", error);
        }
    }
    next();
}
// Middleware để kiểm tra mã thông báo "Ghi nhớ tôi"
const checkRememberMeToken = async (req, res, next) => {
    const rememberMeToken = req.cookies.remember_me;
    console.log("me",rememberMeToken);
    if (rememberMeToken) {
        try {
            // Tìm người dùng dựa trên mã thông báo "Ghi nhớ tôi"
            const user = await userModel.findOne({ rememberMeToken });
            if (user) {
                req.session.user = user;
                return res.redirect('/admin/dashboard');
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Lỗi khi tìm kiếm người dùng theo mã thông báo 'Ghi nhớ tôi':", error);
        }
    }
    next();
}


// Hàm để tạo mã thông báo "Ghi nhớ tôi"
const generateRememberToken = () => {
    // Thực hiện tạo một mã thông báo ngẫu nhiên, bạn có thể sử dụng các phương thức khác nhau để tạo mã này
    const token = crypto.randomBytes(64).toString('hex');
    return token;
}

// Hàm để tìm người dùng bằng mã thông báo "Ghi nhớ tôi"
const findUserByRememberMeToken = async (rememberMeToken) => {
    try {
        const user = await userModel.findOne({ rememberMeToken });
        return user;
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Lỗi khi tìm kiếm người dùng theo mã thông báo 'Ghi nhớ tôi':", error);
        return null;
    }
}

const findUserByRememberCusToken = async (rememberCustomer) => {
    try {
        const user = await customerModel.findOne({ rememberCustomer,provider: "local" });
        return user;
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Lỗi khi tìm kiếm người dùng theo mã thông báo 'Ghi nhớ tôi':", error);
        return null;
    }
}

module.exports = { checkRememberMeToken, generateRememberToken, findUserByRememberMeToken 
,checkRememberCusToken, findUserByRememberCusToken
};
