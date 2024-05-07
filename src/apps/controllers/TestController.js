




const test1 = (req, res) => {
    req.session.email="huhu"
    console.log(req.session.email);
    res.send("")

}
const test2 = (req, res) => {
    console.log(req.session.email);

}


module.exports = {
    test1, test2
}