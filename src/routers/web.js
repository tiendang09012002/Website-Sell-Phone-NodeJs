const express = require('express')
const passport = require('passport')
const AuthController = require('../apps/controllers/AuthController')
const AdminController = require('../apps/controllers/AdminController')
const ProductController = require('../apps/controllers/ProductController')
const UserController = require('../apps/controllers/UserController')
const CategoryController = require('../apps/controllers/CategoryController')
const TestController = require('../apps/controllers/TestController')
const SiteController = require('../apps/controllers/SiteController')
const CommentController = require('../apps/controllers/CommentController')
const OrderController = require('../apps/controllers/OrderController')
const CustomerController=require('../apps/controllers/CustomerController')
const SettingController = require('../apps/controllers/SettingController')
const AuthMiddleware = require('../apps/middlewares/Auth')
const ValidateMiddleware = require('../apps/middlewares/Validation')
const UploadMiddleware = require('../apps/middlewares/Upload')
const RememberMeMiddleware=require('../apps/middlewares/rememberMeMiddleware')
const RememberCusMiddleware=require('../apps/middlewares/rememberMeMiddleware')

const BannerController=require('../apps/controllers/BannerController');
const SlideController=require('../apps/controllers/SlideController');
const router = express.Router();

router.get('/test1', TestController.test1)
router.get('/test2', TestController.test2)




router.get('/admin/login', RememberMeMiddleware.checkRememberMeToken, AuthMiddleware.checkLogin, AuthController.login);
router.get('/admin/logout', AuthMiddleware.checkAdmin, AuthController.logout);
router.post('/admin/login', RememberMeMiddleware.checkRememberMeToken, AuthMiddleware.checkLogin, AuthController.postLogin);

router.get('/admin/dashboard', AuthMiddleware.checkAdmin, AdminController.index)

router.get('/admin/products', AuthMiddleware.checkAdmin, ProductController.index)
router.get('/admin/products/create', AuthMiddleware.checkAdmin, ProductController.create)
router.post('/admin/products/create', AuthMiddleware.checkAdmin, UploadMiddleware.single("thumbnail"), ProductController.store)

router.get('/admin/products/edit/:id', AuthMiddleware.checkAdmin, ProductController.edit)
router.post('/admin/products/edit/:id', AuthMiddleware.checkAdmin, UploadMiddleware.single("thumbnail"), ProductController.update)
router.get('/admin/products/delete/:id', AuthMiddleware.checkAdmin, ProductController.del)
router.post('/admin/products/deleteMany', AuthMiddleware.checkAdmin, ProductController.delMany)

router.get('/admin/products/trash', AuthMiddleware.checkAdmin, ProductController.trash)
router.get('/admin/products/deletereal/:id', AuthMiddleware.checkAdmin, ProductController.delReal)
router.post('/admin/products/actionmany', AuthMiddleware.checkAdmin, ProductController.actionMany)
router.get('/admin/products/restore/:id', AuthMiddleware.checkAdmin, ProductController.restore)


router.get('/admin/users', AuthMiddleware.checkAdmin, UserController.index)
router.get('/admin/users/create', AuthMiddleware.checkAdmin, UserController.create)
router.post('/admin/users/create', AuthMiddleware.checkAdmin, ValidateMiddleware.checkEmail, ValidateMiddleware.checkRePassword, UserController.store)

router.get('/admin/users/edit/:id', AuthMiddleware.checkAdmin, UserController.edit)
router.post('/admin/users/edit/:id', AuthMiddleware.checkAdmin, UserController.update)

router.get('/admin/users/delete/:id', AuthMiddleware.checkAdmin, UserController.del)
router.post('/admin/users/deleteMany', AuthMiddleware.checkAdmin, UserController.delMany)

router.get('/admin/users/trash', AuthMiddleware.checkAdmin, UserController.trash)
router.get('/admin/users/deletereal/:id', AuthMiddleware.checkAdmin, UserController.delReal)
router.post('/admin/users/actionmany', AuthMiddleware.checkAdmin, UserController.actionMany)
router.get('/admin/users/restore/:id', AuthMiddleware.checkAdmin, UserController.restore)


router.get('/admin/categories', AuthMiddleware.checkAdmin, CategoryController.index)
router.get('/admin/categories/create', AuthMiddleware.checkAdmin, CategoryController.create)
router.post('/admin/categories/create', AuthMiddleware.checkAdmin, CategoryController.store)


router.get('/admin/categories/edit/:id', AuthMiddleware.checkAdmin, CategoryController.edit)
router.post('/admin/categories/edit/:id', AuthMiddleware.checkAdmin, CategoryController.update)
router.get('/admin/categories/delete/:id', AuthMiddleware.checkAdmin, CategoryController.del)
router.post('/admin/categories/deleteMany', AuthMiddleware.checkAdmin, CategoryController.delMany)

router.get('/admin/categories/trash', AuthMiddleware.checkAdmin, CategoryController.trash)
router.get('/admin/categories/deletereal/:id', AuthMiddleware.checkAdmin, CategoryController.delReal)
router.post('/admin/categories/actionmany', AuthMiddleware.checkAdmin, CategoryController.actionMany)
router.get('/admin/categories/restore/:id', AuthMiddleware.checkAdmin, CategoryController.restore)

router.get('/admin/customers', AuthMiddleware.checkAdmin, CustomerController.index)
router.get('/admin/customers/delete/:id', AuthMiddleware.checkAdmin, CustomerController.del)
router.post('/admin/customers/deleteMany', AuthMiddleware.checkAdmin, CustomerController.delMany)
router.get('/admin/customers/trash', AuthMiddleware.checkAdmin, CustomerController.trash)
router.get('/admin/customers/deletereal/:id', AuthMiddleware.checkAdmin, CustomerController.delReal)
router.post('/admin/customers/actionmany', AuthMiddleware.checkAdmin, CustomerController.actionMany)
router.get('/admin/customers/restore/:id', AuthMiddleware.checkAdmin, CustomerController.restore)


router.get('/admin/comments', AuthMiddleware.checkAdmin, CommentController.index)
router.get('/admin/comments/delete/:id', AuthMiddleware.checkAdmin, CommentController.del)
router.get('/admin/comments/edit/:id', AuthMiddleware.checkAdmin, CommentController.active)
router.post('/admin/comments/deleteMany', AuthMiddleware.checkAdmin, CommentController.delMany)
router.get('/admin/comments/trash', AuthMiddleware.checkAdmin, CommentController.trash)
router.get('/admin/comments/deletereal/:id', AuthMiddleware.checkAdmin, CommentController.delReal)
router.post('/admin/comments/actionmany', AuthMiddleware.checkAdmin, CommentController.actionMany)
router.get('/admin/comments/restore/:id', AuthMiddleware.checkAdmin, CommentController.restore)
router.post('/admin/comments/addkeyword', AuthMiddleware.checkAdmin, CommentController.addKeyword)

router.get('/admin/orders', AuthMiddleware.checkAdmin, OrderController.index)
router.get('/admin/orders/delete/:id', AuthMiddleware.checkAdmin, OrderController.del)
router.get('/admin/orders/edit/:id', AuthMiddleware.checkAdmin, OrderController.edit)

router.get('/admin/orders/update/:id', AuthMiddleware.checkAdmin, OrderController.update)
router.post('/admin/orders/deleteMany', AuthMiddleware.checkAdmin, OrderController.delMany)
router.get('/admin/orders/trash', AuthMiddleware.checkAdmin, OrderController.trash)
router.get('/admin/orders/deletereal/:id', AuthMiddleware.checkAdmin, OrderController.delReal)
router.post('/admin/orders/actionmany', AuthMiddleware.checkAdmin, OrderController.actionMany)
router.get('/admin/orders/restore/:id', AuthMiddleware.checkAdmin, OrderController.restore)

router.get('/admin/settings', AuthMiddleware.checkAdmin, SettingController.index)
router.post('/admin/settings', UploadMiddleware.single('logo'), AuthMiddleware.checkAdmin, SettingController.update);

//banner
router.get('/admin/banners', AuthMiddleware.checkAdmin, BannerController.banner);
router.get('/admin/banners/create', AuthMiddleware.checkAdmin, BannerController.create);
router.post('/admin/banners/create', AuthMiddleware.checkAdmin, UploadMiddleware.single("thumbnail"), BannerController.store);
router.get('/admin/banners/delete/:id', AuthMiddleware.checkAdmin, BannerController.del)
router.get('/admin/banners/edit/:id', AuthMiddleware.checkAdmin, BannerController.edit)
router.post('/admin/banners/edit/:id', AuthMiddleware.checkAdmin, UploadMiddleware.single("thumbnail"), BannerController.update)
//slide
router.get('/admin/slides', AuthMiddleware.checkAdmin, SlideController.slide);
router.get('/admin/slides/create', AuthMiddleware.checkAdmin, SlideController.create);
router.post('/admin/slides/create', AuthMiddleware.checkAdmin, UploadMiddleware.single("thumbnail"), SlideController.store);
router.get('/admin/slides/delete/:id', AuthMiddleware.checkAdmin, SlideController.del)
router.get('/admin/slides/edit/:id', AuthMiddleware.checkAdmin, SlideController.edit)
router.post('/admin/slides/edit/:id', AuthMiddleware.checkAdmin, UploadMiddleware.single("thumbnail"), SlideController.update)




// Router Site
router.get('/user/login',  SiteController.login) 
router.post('/user/login',  AuthMiddleware.checkLoginCustomer, SiteController.postLogin)
router.get('/user/register', AuthMiddleware.checkLoginCustomer, SiteController.register)
router.post('/user/register', AuthMiddleware.checkLoginCustomer, SiteController.postregister)


router.get('/user/logout', AuthMiddleware.checkCustomer,SiteController.logout)




router.get("/", SiteController.home);
router.get("/category-:slug.:id", SiteController.category);
router.get("/product-:slug.:id", SiteController.product);
router.post("/product-:slug.:id", SiteController.createComment);

router.get("/search", SiteController.search);
router.get("/searchSuggestions", SiteController.searchSuggestions);

router.get("/cart", SiteController.cart);
router.get("/success", SiteController.success);

router.post("/add-to-cart", SiteController.addToCart);
router.post("/update-item-cart", SiteController.updateItemCart);
router.get("/delete-item-cart/:id", SiteController.deleteItemCart);
router.post("/order", AuthMiddleware.checkCustomer, SiteController.order);
router.get("/forgot-password", SiteController.forgotPassword);
router.post("/forgot-password",SiteController.postForgotPassword);
router.post("/active-password", SiteController.activePassword);

router.get('/auth/google', AuthMiddleware.checkLoginCustomer, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/site/login', session: false }),
    function (req, res) {
        // Successful authentication, redirect home.
        console.log(req.user);
        req.session.user = req.user
        return res.redirect('/');
    });
router.get('/auth/facebook',AuthMiddleware.checkLoginCustomer,
    passport.authenticate('facebook',{ scope: ['email'] }));

router.get('/facebook/redirect',
    passport.authenticate('facebook', { failureRedirect: '/login',session: false }),
    function (req, res) {
        // Successful authentication, redirect home.
        console.log(req.user);
        req.session.user = req.user
        res.redirect('/');
    });


module.exports = router;
