const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('config');
const passport = require('passport')
const bcrypt = require('bcrypt');
const CustomerModel = require('../../models/customer')
const GoogleLogin = () => {
    passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    },
        async function (accessToken, refreshToken, profile, cb) {
            const customer = {
                full_name: profile._json.given_name,
                email: profile._json.email,
                provider: "google",
                password: await bcrypt.hash(profile._json.sub, 10)

            }
            let user = await CustomerModel.findOne({ email: customer.email })
            if (!user)
                user = await new CustomerModel(customer).save()
            return cb(null, user);

            // console.log("all",cb);

            // User.findOrCreate({ googleId: profile.id }, function (err, user) {
            //   return cb(err, user);
            // });
        }
    ));
}

module.exports = GoogleLogin;