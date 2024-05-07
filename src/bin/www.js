const config = require('config')
const app=require(`${__dirname}/../apps/app`)

const server = app.listen(port = config.app.port, (req, res) => {
    console.log('Server running on port ' + port);
});
