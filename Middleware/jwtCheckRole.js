const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    // console.log("Headers:", req.headers);
    const token = req.cookies?.token; // get token from cookie or header
    if (!token) {
        return res.status(401).json({ error: "ไม่มี token หรือ token ผิด" });
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // compare and decode token with secret key
        req.user = verified; 
        next(); // next route
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Session หมดอายุ กรุณา Login ใหม่" });
        }
        return res.status(403).json({ error: "Token ไม่ถูกต้อง!" });
    }
};

module.exports = { verifyToken };
