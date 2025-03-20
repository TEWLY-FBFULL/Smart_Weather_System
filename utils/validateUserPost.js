const joi = require("joi");
const sanitizeHtml = require("sanitize-html");

// XSS prevention
const sanitizeInput = (input) => {
    return sanitizeHtml(input, {
        allowedTags: [],
        allowedAttributes: {}
    }).trim();
};

// Schema 
const postWeatherSchema = joi.object({
    city: joi.string()
        .min(2)
        .max(50)
        .custom((value, helpers) => {
            const cleanValue = sanitizeInput(value);
            if (!cleanValue) return helpers.error("any.invalid");
            return cleanValue;
        })
        .required()
        .messages({
            "string.min": "ชื่อเมืองต้องมีความยาวอย่างน้อย 2 ตัวอักษร",
            "string.max": "ชื่อเมืองต้องไม่เกิน 50 ตัวอักษร",
            "any.invalid": "ชื่อเมืองมีอักขระที่ไม่ปลอดภัย",
            "any.required": "กรุณากรอกชื่อเมือง"
        }),

    message: joi.string()
        .min(10)
        .max(1000)
        .custom((value, helpers) => {
            const cleanValue = sanitizeInput(value);
            if (!cleanValue) return helpers.error("any.invalid");
            return cleanValue;
        })
        .required()
        .messages({
            "string.min": "ข้อความต้องมีความยาวอย่างน้อย 10 ตัวอักษร",
            "string.max": "ข้อความต้องไม่เกิน 1000 ตัวอักษร",
            "any.invalid": "ข้อความมีอักขระที่ไม่ปลอดภัย",
            "any.required": "กรุณากรอกข้อความ"
        })
});

// Validate
const validatePostWeather = (data) => {
    const { error, value } = postWeatherSchema.validate(data);
    if (error) {
        return error.details[0].message;
    }
    return null;
};

module.exports = validatePostWeather;
