module.exports = {
    app: {
        port: 3000,
        static_folder: `${__dirname}/../src/public`,
        view_folder: `${__dirname}/../src/apps/views`,
        view_engine: 'ejs',
        session_key: 'Vietpro',
        session_secure: false,
        tmp: `${__dirname}/../src/tmp/`,
    },
    mail: {
        port: 587,
        host: "smtp.gmail.com",
        secure: false, // Use `true` for port 465, `false` for all other ports
        user: "phamquyduong2k2@gmail.com",
        pass: "vdbbwgykbxeumsuc",
    },
    google: {
        clientID:"706410878404-knd0toamkq02oka9cbvp3m36okm769ru.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL:"http://localhost:3000/google/redirect"
    },
    facebook: {
        FACEBOOK_APP_ID:1173477803799181,
        FACEBOOK_APP_SECRET:"95efef9cbd60742a92c69af78ebb68db",
        callbackURL:"http://localhost:3000/facebook/redirect",
    }
}
