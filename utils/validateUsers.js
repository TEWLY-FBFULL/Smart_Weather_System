const joi = require('joi'); // validate data

const registerSchema = joi.object({
    user_name: joi.string().min(3).max(50).required().messages({
        'string.min': 'ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร',
        'string.max': 'ชื่อผู้ใช้ต้องไม่เกิน 50 ตัวอักษร',
        'any.required': 'กรุณากรอกชื่อผู้ใช้',
    }),
    email: joi.string().email().max(50).required().messages({
        'string.email': 'อีเมลไม่ถูกต้อง',
        'any.required': 'กรุณากรอกอีเมล',
    }),
    password: joi.string()
        .min(8)
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)
        .messages({
            'string.min': 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
            'string.pattern.base': 'รหัสผ่านต้องประกอบด้วยตัวอักษร ตัวเลข และอักษรพิเศษอย่างน้อย 8 ตัวอักษร',
            'any.required': 'กรุณากรอกรหัสผ่าน',
        })
        .required(),
});

const validateUser = (data) =>{
    const {error} = registerSchema.validate(data);
    if(error){
        return error.details[0].message;
    }
    return null;
}

module.exports = validateUser;