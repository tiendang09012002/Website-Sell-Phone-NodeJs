const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const config = require('config');
const bcrypt = require('bcrypt');
const CustomerModel = require('../../models/customer')
const FacebookLogin = () => {
    passport.use(new FacebookStrategy({
        clientID: config.facebook.FACEBOOK_APP_ID,
        clientSecret: config.facebook.FACEBOOK_APP_SECRET,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id', "displayName", 'email']
    },
        async function (accessToken, refreshToken, profile, cb) {
            console.log(profile);
            const customer = {
                full_name: profile._json.name,
                email: profile._json.email,
                provider: "facebook",
                password: await bcrypt.hash(profile._json.id, 10)

            }
            let user = await CustomerModel.findOne({ email: customer.email })
            if (!user)
                user = await new CustomerModel(customer).save()
            return cb(null, user);
        }
    ));
}
module.exports = FacebookLogin