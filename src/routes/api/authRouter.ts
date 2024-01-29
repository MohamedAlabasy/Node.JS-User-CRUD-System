import { Router } from 'express';
import checkTokens from '../../utilities/checkTokens';
import { body, check, param } from 'express-validator';
import { login, register, getUserByID, getAllUser, updateUser, updateUserToBeAdmin, deleteUser } from '../../controllers/authController';

const auth: Router = Router();

auth.post('/login', checkEmail(), checkPassword(), login);
auth.post('/register', checkEmail(), checkPassword(), checkRegisterData(), register);
auth.get('', checkTokens, getAllUser)
auth.get('/:id', checkTokens, checkID(), getUserByID)
auth.patch('/admin/:id', checkTokens, checkID(), checkUpdateUserToBeAdmin(), updateUserToBeAdmin)
auth.patch('/:id', checkTokens, checkUpdateData(), updateUser)
auth.delete('/:id', checkTokens, checkID(), deleteUser)

// #=======================================================================================#
// #			                         check function                                    #
// #=======================================================================================#
function checkID() {
    return [
        param("id").exists().withMessage('you must enter id').isMongoId().withMessage('invalid Comment id')
    ]
}

function checkEmail() {
    return [
        check('email').exists().withMessage('you must enter email').isEmail().withMessage('invalid email')
    ]
}

function checkPassword() {
    return [
        body('password').exists().withMessage('you must enter password').isStrongPassword().withMessage('Password Must contain at least 1 characters(upper and lower),numbers,special characters'),
    ]
}

function checkRegisterData() {
    return [
        body('name')
            .exists().withMessage('you must enter name')
            .isString().withMessage('invalid name'),
        body('age')
            .exists().withMessage('you must enter age')
            .isFloat({ min: 20, max: 100 }).withMessage('age must be a number between 20 and 100'),
        body('country')
            .exists().withMessage('you must enter country')
            .isString().withMessage('invalid country'),
        body('mobile')
            .exists().withMessage('you must enter mobile')
            .isString().isLength({ min: 11, max: 11 }).withMessage('mobile length must be 11 number')
            .matches(/^[90][0-9]{2}[12][0-9]{2}[0-9]{5}$/).withMessage('invalid mobile number'),
    ]
}

function checkUpdateUserToBeAdmin() {
    return [
        body('is_admin')
            .exists().withMessage('you must enter is_admin')
            .isBoolean().withMessage('must be boolean value'),]
}

function checkUpdateData() {
    return [
        body('name')
            .optional().isString().withMessage('invalid name'),
        body('age')
            .optional().isFloat({ min: 20, max: 100 }).withMessage('age must be a number between 20 and 100'),
        body('country')
            .optional().isString().withMessage('invalid country'),
        body('mobile')
            .optional().isString().isLength({ min: 11, max: 11 }).withMessage('mobile length must be 11 number')
            .matches(/^[90][0-9]{2}[12][0-9]{2}[0-9]{5}$/).withMessage('invalid mobile number'),
    ]
}

export default auth;