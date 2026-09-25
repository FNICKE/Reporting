const { body } = require("express-validator");


// ========================================
// LOGIN
// ========================================

const loginValidator = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .withMessage("Password is required")

];


// ========================================
// CREATE USER
// ========================================

const createUserValidator = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({
            min: 2
        })
        .withMessage(
            "Name must be at least 2 characters"
        ),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage(
            "Please enter a valid email"
        ),

    body("mobile")
        .optional()
        .trim(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({
            min: 6
        })
        .withMessage(
            "Password must be at least 6 characters"
        ),

    body("role_id")
        .notEmpty()
        .withMessage("Role is required")
        .isInt()
        .withMessage(
            "Role ID must be a number"
        )

];


module.exports = {
    loginValidator,
    createUserValidator
};