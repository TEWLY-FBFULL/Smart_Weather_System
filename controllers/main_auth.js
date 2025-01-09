const { checkEmailAndUsername,insertUser,checkEmailToken,updateEmailVerified } = require('../models/usersModel'); // DBMS
const { hashpassword, generateToken, sendEmail, validateUser } = require('../utils'); // Utils

// Login
exports.login = (req,res) => {
    res.json({message: 'Hello from login'});
};

// Register
exports.register = async (req,res) => {
    // Get data from request    
    const {user_name,email,password} = req.body;
    try{
        // Validate data
        const validationError = validateUser(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        // Check email and user_name
        const existingUser = await checkEmailAndUsername(email, user_name); 
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'อีเมลหรือชื่อผู้ใช้นี้ถูกใช้ไปแล้ว' });
        }
        // Hash password
        const hash = await hashpassword(password);
        // Generate token
        const email_token = await generateToken();
        // Get IP Address
        const ip_address = req.ip;
        // SQL Query
        await insertUser(user_name, email, hash, email_token, ip_address);
        // Send verification Email
        const verificationLink = `http://localhost:3000/api/auth/verifyEmail?token=${email_token}`;
        const emailSubject = 'ยืนยันอีเมล์ของคุณ';
        const emailHtml = `<p>กรุณาคลิกลิงค์ด้านล่างเพื่อยืนยันอีเมลของคุณ:</p>
                            <form action="${verificationLink}" method="POST">
                                <input type="hidden" name="token" value="${email_token}"/>
                                <button type="submit">ยืนยันอีเมล</button>
                            </form>`;
        try {
            await sendEmail(email, emailSubject, emailHtml);
        } catch (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ 
                message: 'การลงทะเบียนสำเร็จ แต่เกิดข้อผิดพลาดในการส่งอีเมลยืนยัน กรุณาลองอีกครั้ง' 
            });  
        }                      
        // Success
        res.status(200).json({ message: 'การลงทะเบียนสำเร็จ! กรุณายืนยันอีเมลของคุณ' });
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
};

// Logout
exports.logout = (req,res) => {
    res.json({message: 'Hello from logout'});
};

// Forget Password
exports.forgetPassword = (req,res) => {
    res.json({message: 'Hello from forget password'});
};

// Verify Email
exports.verifyEmail = async (req, res) => {
    // Get token from request
    const { token } = req.body;
    // Check token
    if (!token || token.trim() === '') {
        return res.status(400).json({ error: 'ไม่พบ Token หรือ Token ไม่ถูกต้อง' });
    }
    try {
        // Check token in database
        const checkTokenQuery = await checkEmailToken(token);
        if (checkTokenQuery.length === 0){
            return res.status(400).json({ error: 'ลิงก์ยืนยันไม่ถูกต้องหรือหมดอายุ' });
        }
        const user = checkTokenQuery[0];
        // Update email_verified = True
        const updateQuery = await updateEmailVerified(user.user_id);
        if (updateQuery.affectedRows === 0){
            return res.status(400).json({ error: 'ไม่สามารถยืนยันอีเมลของคุณได้' });
        }
        // Success
        res.status(200).json({ message: 'ยืนยันอีเมลสำเร็จ! คุณสามารถเข้าสู่ระบบได้แล้ว' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
