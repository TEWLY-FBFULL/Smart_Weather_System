const { checkEmailAndUsername, insertUser, checkEmailToken,
    updateEmailVerified, updateLastSeenTime, updateUserPassword, updateEmailToken  } = require('../models/usersModel'); // DBMS
const { hashpassword, generateToken, sendEmail, validateUser, 
    comparePassword, generateJWTtoken, validateResetPassword } = require('../utils'); // Utils

// Login
exports.login = async (req,res) => {
    // Get data from request
    const {user_nameORemail,password} = req.body;
    try{
        // Check email or user_name
        const user = await checkEmailAndUsername(user_nameORemail, user_nameORemail);
        if (user.length !== 1){
            return res.status(400).json({error: 'ไม่มีชื่อผู้ใช้หรืออีเมลนี้'});
        }
        // Check password and email_verified
        const dbUser = user[0];
        const passwordMatch = await comparePassword(password, dbUser.user_password);
        if (!passwordMatch){
            return res.status(400).json({error: 'รหัสผ่านไม่ถูกต้อง'});
        }
        else if (!dbUser.email_verified){
            return res.status(400).json({error: 'กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ'});
        }
        // Update last seen time
        const date = new Date(); date.setHours(date.getHours() + 7); // GMT +7
        const timestamp = date.toISOString().slice(0, 19).replace("T", " ");
        await updateLastSeenTime(dbUser.user_id, timestamp);
        // Success -> Send JWT token
        const token = await generateJWTtoken(dbUser.user_id,dbUser.user_name,dbUser.email,dbUser.role_id);
        res.cookie('token', token, { httpOnly: true, secure: false, sameSite: "Lax", path: "/" });
        return res.status(200).json({ message: 'เข้าสู่ระบบสำเร็จ', role_id: dbUser.role_id});
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
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
        res.status(201).json({ message: 'การลงทะเบียนสำเร็จ! กรุณายืนยันอีเมลของคุณ' });
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
};

// Logout
exports.logout = (req,res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        path: "/"
    });
    res.status(200).json({ message: "ออกจากระบบสำเร็จ" });
};

// Forget Password
exports.forgetPassword = async (req,res) => {
    const { email } = req.body;
    try{
        const user = await checkEmailAndUsername(email, email);
        if (user.length === 0){
            return res.status(400).json({error: 'ไม่พบอีเมลนี้ในระบบ'});
        }
        else if (!user[0].email_verified){
            return res.status(400).json({error: 'กรุณายืนยันอีเมลของคุณก่อน'});
        }
        // Generate token and Update email_verification_token
        const email_token = await generateToken();
        await updateEmailToken(user[0].user_id, email_token);
        // Send verification Email
        const verificationLink = `http://localhost:3000/resetPassword.html?token=${email_token}`;
        const emailSubject = 'เปลี่ยนรหัสผ่านของคุณ';
        const emailHtml = `<p>กรุณาคลิกลิงค์ด้านล่างเพื่อเปลี่ยนรหัสผ่านของคุณ:</p>
                            <form action="${verificationLink}" method="GET">
                                <input type="hidden" name="token" value="${email_token}"/>
                                <button type="submit">ยืนยันการเปลี่ยนรหัสผ่าน</button>
                            </form>;`
        try {
            await sendEmail(email, emailSubject, emailHtml);
        } catch (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ 
                message: 'เกิดข้อผิดพลาดในการส่งอีเมลยืนยัน กรุณาลองอีกครั้ง' 
            });  
        }                      
        // Success
        res.status(200).json({ message: 'ส่งลิ้งการเปลี่ยนรหัสผ่านไปยังอีเมลของคุณสำเร็จ กรุณาตรวจสอบอีเมลของคุณ' });
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
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
        res.status(200).send('<h1>ยืนยันอีเมลสำเร็จ!</h1><p>คุณสามารถเข้าสู่ระบบได้แล้ว</p><a href="http://localhost:3000/">เข้าสู่ระบบ</a>');
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    // Get token from request
    const { token, password } = req.body;
    try {
        // Validate data
        const validationError = validateResetPassword(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        // Check token in database
        const checkTokenQuery = await checkEmailToken(token);
        if (checkTokenQuery.length === 0){
            return res.status(400).json({ error: 'ลิงก์ยืนยันไม่ถูกต้องหรือหมดอายุ' });
        }
        const user = checkTokenQuery[0];
        // Hash password
        const hash = await hashpassword(password);
        // Update user password
        const updateQuery = await updateUserPassword(user.user_id, hash);
        if (updateQuery.affectedRows === 0){
            return res.status(400).json({ error: 'ไม่สามารถเปลี่ยนรหัสผ่านของคุณได้' });
        }
        // Update email_verified = True and email_verification_token = NULL
        const deleteTokenQuery = await updateEmailVerified(user.user_id);
        if (deleteTokenQuery.affectedRows === 0){
            return res.status(400).json({ error: 'ไม่สามารถลบ token ได้' });
        }
        // Success
        res.status(200).json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}
