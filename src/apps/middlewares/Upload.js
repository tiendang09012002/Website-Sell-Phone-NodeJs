const multer  = require('multer')
const config = require('config')
const upload = multer({ dest: config.app.tmp })

module.exports=upload