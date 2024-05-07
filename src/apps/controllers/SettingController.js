const settingModel = require('../models/setting')
const fs = require('fs')
const path = require('path')
const index = async (req, res) => {
    const setting = await settingModel.findOne()
    res.render('admin/settings/setting', { setting })
}
const update = async (req, res) => {
    const st = await settingModel.findOne()
    const { body, file } = req
    const setting = body
    if (file) {
        const pathImage = path.resolve("src/public/uploads/images", st.logo)
        if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage)
        }
        logo = "settings/" + file.originalname;
        fs.renameSync(file.path, path.resolve("src/public/uploads/images", logo))
        setting["logo"] = logo;
    }

    await settingModel.update({a:null}, setting)
    res.redirect('/admin/settings')

}

module.exports = {
    index, update
}