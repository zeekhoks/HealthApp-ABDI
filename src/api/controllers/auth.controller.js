const authSerivce = require('../services/auth.service');

const validateToken = async (req, res) => {
    console.log("In validateToken method");
    const authorizationHeader = req.headers.authorization;
    console.log("Authorization Header>>>>>>>" + authorizationHeader);
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const token = authorizationHeader.split(' ')[1];
        try {
            const isTokenValid = await authSerivce.validateToken(token);
            if(isTokenValid){
                res.status(200).json({ message: 'Token is valid' });
            }
        } catch (error) {
            console.log(error)
            res.status(401).json({ error: 'Authentication failed' });
        }
    } else {
        res.status(401).json({ error: 'Invalid bearer token' });
    }
};

module.exports = {
    validateToken: validateToken
};