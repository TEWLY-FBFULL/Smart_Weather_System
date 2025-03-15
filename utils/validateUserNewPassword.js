const joi = require('joi'); // validate data

const resetPasswordSchema = joi.object({
    token: joi.string().required().messages({
        'any.required': 'Token ไม่ถูกต้องหรือหมดอายุ',
    }),
    password: joi.string()
        .min(8)
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)
        .required()
        .messages({
            'string.min': 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
            'string.pattern.base': 'รหัสผ่านต้องมีตัวอักษร ตัวเลข และอักขระพิเศษ (!@#$%^&*) อย่างน้อย 1 ตัว',
            'any.required': 'กรุณากรอกรหัสผ่าน',
        }),
    confirm_password: joi.any()
        .valid(joi.ref('password'))
        .required()
        .messages({
            'any.only': 'รหัสผ่านไม่ตรงกัน',
            'any.required': 'กรุณายืนยันรหัสผ่าน',
        }),
});

// ฟังก์ชันตรวจสอบข้อมูล
const validateResetPassword = (data) => {
    const { error } = resetPasswordSchema.validate(data);
    if (error) {
        return error.details[0].message;
    }
    return null;
};

module.exports = validateResetPassword;
