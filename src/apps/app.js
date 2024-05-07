const express = require('express');
const config = require("config")
const app = express();
const router = require(`${__dirname}/../routers/web`)
const session = require('express-session')
const ShareMiddleware = require('./middlewares/share')
const CartMiddleware = require('./middlewares/cart')
const GoogleLogin=require('./controllers/social/GoogleController');
const FacebookLogin=require('./controllers/social/FacebookController')

const cookieParser = require('cookie-parser');
//set template engine
app.set("views",config.app.view_folder)
app.set("view engine",config.app.view_engine)


app.use(express.urlencoded({ extended: true }))
app.use("/static", express.static(config.app.static_folder))

app.use(cookieParser()); // Sử dụng cookie-parser middleware

// Các cài đặt và cấu hình khác của ứng dụng



app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: config.app.session_key,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: config.app.session_secure },
}))
app.use(CartMiddleware)
app.use(ShareMiddleware)
GoogleLogin()
FacebookLogin()


app.use(router);
module.exports=app;

