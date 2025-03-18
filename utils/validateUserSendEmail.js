const joi = require('joi'); // Validate data
const sanitizeHtml = require('sanitize-html'); // Prevent XSS

// Sanitize function to clean input data
const sanitizeInput = (input) => {
    return sanitizeHtml(input, {
        allowedTags: [],
        allowedAttributes: {} 
    }).trim();
};

const userSendEmailSchema = joi.object({
    name: joi.string()
        .min(3)
        .max(50)
        .custom((value, helpers) => {
            const cleanValue = sanitizeInput(value);
            if (!cleanValue) return helpers.error('any.invalid');
            return cleanValue;
        })
        .required()
        .messages({
            'string.min': 'ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร',
            'string.max': 'ชื่อผู้ใช้ต้องไม่เกิน 50 ตัวอักษร',
            'any.invalid': 'ชื่อผู้ใช้มีอักขระที่ไม่ปลอดภัย',
            'any.required': 'กรุณากรอกชื่อผู้ใช้',
        }),

    email: joi.string()
        .email()
        .max(50)
        .custom((value, helpers) => {
            const cleanValue = sanitizeInput(value);
            if (!cleanValue) return helpers.error('any.invalid');
            return cleanValue;
        })
        .required()
        .messages({
            'string.email': 'อีเมลไม่ถูกต้อง',
            'any.invalid': 'อีเมลมีอักขระที่ไม่ปลอดภัย',
            'any.required': 'กรุณากรอกอีเมล',
        }),

    message: joi.string()
        .min(8)
        .max(1000) // Protect against long text
        .custom((value, helpers) => {
            const cleanValue = sanitizeInput(value);
            if (!cleanValue) return helpers.error('any.invalid');
            return cleanValue;
        })
        .required()
        .messages({
            'string.min': 'ข้อความต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
            'string.max': 'ข้อความต้องไม่เกิน 1000 ตัวอักษร',
            'any.invalid': 'ข้อความมีอักขระที่ไม่ปลอดภัย',
            'any.required': 'กรุณากรอกข้อความ',
        }),
});

const validateUserSendEmail = (data) => {
    const { error, value } = userSendEmailSchema.validate(data);
    if (error) {
        return error.details[0].message;
    }
    return null;
};

module.exports = validateUserSendEmail;
