const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(403).json({ error: 'คุณไม่ได้รับอนุญาต' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // แนบข้อมูล Role และ userId ไปใน req
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token ไม่ถูกต้องหรือหมดอายุ' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้' });
    }
    next();
};

module.exports = { verifyToken, isAdmin };
