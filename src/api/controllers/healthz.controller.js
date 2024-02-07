const ping = async(req, res) => {
    console.log("In healthz controller");
    res.status(200).send()
}

module.exports = {
    ping: ping
};