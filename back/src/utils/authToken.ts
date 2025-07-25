const jwt = require('jsonwebtoken');

export const authToken = (req, jwt_secret) => {
    const token = req.cookies.jwtToken

    if (!token) {
        return false
    }

    jwt.verify(token, jwt_secret, () => {
        return false;
    });

    return true;
};