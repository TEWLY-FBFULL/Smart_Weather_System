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
            return res.status(401).send('<h1>Session หมดอายุ</h1><p>กรุณาเข้าสู่ระบบใหม่</p>');
        }
        return res.status(403).json({ error: "Token ไม่ถูกต้อง!" });
    }
};

// Middleware for User
const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role_id === 2) {
            next();
        } else {
            return res.status(403).json({ error: "ไม่มีสิทธิ์เข้าถึง" });
        }
    });
};

// Middleware for Admin
const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role_id === 1) {
            next();
        } else {
            return res.status(403).json({ error: "ต้องเป็น Admin เท่านั้น!" });
        }
    });
};

module.exports = { verifyToken, verifyUser, verifyAdmin };
