import Joi from 'joi';

//PARAMETER ID VALIDATION
const paramsIdSchema = Joi.object({
    id: Joi.number().integer().positive().required()

});

export const validateParamsID = (req, res, next) => {
    const { error } = paramsIdSchema.validate(req.params)
    if (error) {
        return res.status(400).json({ success: false, message: "Id parameter Should be Positive Number" });
    }
    next();
}

//VALIDATING  PRODUCTID AND QUANTITY
const cartproductSchemaId = Joi.object({
    productId: Joi.number().integer().positive().required(),
    quantity: Joi.number().integer().positive().required()
})

export const validateCartProductUpdates = (req, res, next) => {
    const { error } = cartproductSchemaId.validate(req.body)
    if (error) {
        return res.status(400).json({ success: false, message: "Both id parameter Should be Positive Number" });
    }
    next();
}


//VALIDATION FOR USER(USERNAME,EMAIL,PASSWORD)
const userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$*])[A-Za-z\d@$*?&]{8,12}$/).messages({
        'string.pattern.base': 'Password should contains 8-12 characters having atleast one uppercase, lowercase, digit & special character(@,$,*)'
    })
})

export const validateUserData = (req, res, next) => {
    const { error } = userSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
    next();
}


//VALIDATION FOR PRODUCTS
const productSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().positive().required(),
    description: Joi.string().required(),
    categoryID: Joi.number().integer().positive().required(),
    // image: Joi.string().required()
})

export const validatepProductData = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Image is required." });
    }
    const { title, price, description, categoryID } = req.body;
    const { error } = productSchema.validate({
        title, price: parseFloat(price), description, categoryID: parseInt(categoryID)
    })
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
    next();
}


//VALIDATION FOR CATEGORY SCHEMA
const categorySchema = Joi.object({
    categoryName: Joi.string()
})

export const validateCategoryData = (req, res, next) => {
    const { error } = categorySchema.validate(req.body)
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
    next();
}


//VALIDATION FOR CART SCHEMA
const cartSchema = Joi.object({
    id: Joi.number().integer(),
    userId: Joi.number().integer()
})

export const validateCartCredentials = (req, res, next) => {
    const { error } = cartSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
    next();
}


//VALIDATION FOR CART-PRODUCTS SCHEMA
const cartProductSchema = Joi.object({
    cartId: Joi.number().integer(),
    productId: Joi.number().integer(),
    quantity: Joi.number().integer().min(1)
})

export const validateCartProductData = (req, res, next) => {
    const { error } = cartProductSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
    next();
}


//VALIDATE LOGIN CREDENTIALS
const loginSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$*])[A-Za-z\d@$*?&]{8,12}$/).messages({
        'string.pattern.base': 'Password should contains 8-12 characters having atleast one uppercase, lowercase, digit & special character(@,$,*)'
    })
})

export const validateLoginCredentials = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
    next();
}