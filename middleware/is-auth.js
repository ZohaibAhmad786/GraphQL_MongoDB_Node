const jsonwebtoken = require("jsonwebtoken");

module.exports = (req, res, next) => {

    //Check the Authorization Header
    const authHeader = req.get("Authorization");

    if (!authHeader) {
        req.isAuthenticated = false;
        return next();
    }

    // Check Authorization has the token
    const token = authHeader.split(" ")[1];

    if (!token || token === "") {
        req.isAuthenticated = false;
        return next();
    }

    let decodedToken;

    try {
        //Verify the token
        decodedToken = jsonwebtoken.verify(token, "someSuperKeyThatCanBeAnything");
    } catch (error) {
        req.isAuthenticated = false;
        return next();
    }

    if (!decodedToken) {
        req.isAuthenticated = false;
        return next();
    }

    // extrating data from token
    req.isAuthenticated = true;
    req.userId = decodedToken.userId
    return next();


}