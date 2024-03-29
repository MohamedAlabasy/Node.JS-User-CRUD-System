import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userSchema';
import { HttpError } from '../utilities/HttpError';
import validateRequest from '../utilities/validateRequest';

const unreturnedData = "-createdAt -updatedAt -__v";
// #=======================================================================================#
// #			                            login                                          #
// #=======================================================================================#
export const login = async (request: Request, response: Response, next: NextFunction) => {
    try {
        validateRequest(request);
        const userData = await User.findOne({ email: (request.body.email as string).toLocaleLowerCase() }).select(`+password ${unreturnedData}`)
        if (!userData) throw new HttpError('invalid email', 404)

        const passwordIsValid = bcrypt.compareSync(request.body.password, userData.password);
        if (!passwordIsValid) throw new HttpError(`invalid password`, 401)

        // add token
        const accessToken = createToken(userData)

        response.status(200).json(returnUserData(userData, accessToken))
    } catch (error: any) {
        console.error("\x1b[31m", 'auth-controller => login : ' + error.message, "\x1b[0m");
        next(error);
    }
}


// #=======================================================================================#
// #			                            Register                                       #
// #=======================================================================================#
export const register = async (request: Request, response: Response, next: NextFunction) => {
    try {
        validateRequest(request);

        const user = new User({
            name: request.body.name,
            email: request.body.email,
            password: hashPassword(request.body.password),
            age: request.body.age,
            country: request.body.country,
            mobile: request.body.mobile,
            is_admin: request.body.TESTING_SECRET_KEY === process.env.TESTING_SECRET_KEY ? true : false
        })
        const userData = await user.save();
        if (!userData) throw new HttpError('can\'t add user', 500);

        response.status(200).json(returnUserData(userData));
    } catch (error: any) {
        if (error.code === 11000) error.message = 'this email already used'
        console.error("\x1b[31m", 'auth-controller => register : ' + error.message, "\x1b[0m");
        next(error);
    }
}


// #=======================================================================================#
// #			                       get User by id                                      #
// #=======================================================================================#
export const getUserByID = async (request: Request, response: Response, next: NextFunction) => {
    try {
        validateRequest(request)
        const userData = await User.findById(request.params.id).select(unreturnedData)
        if (!userData) throw new HttpError(`No user with this id = ${request.params.id}`, 404)

        response.status(200).json(returnUserData(userData));
    } catch (error: any) {
        console.error("\x1b[31m", 'auth-controller => getUserByID : ' + error.message, "\x1b[0m");
        next(error);
    }
}

// #=======================================================================================#
// #			                       get All Users                                       #
// #=======================================================================================#
export const getAllUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
        validateRequest(request)
        const userData = await User.find({}).select(unreturnedData);
        response.status(200).json(returnAllUserData(userData));
    } catch (error: any) {
        console.error("\x1b[31m", 'auth-controller => getAllUser : ' + error.message, "\x1b[0m");
        next(error);
    }
}

// #=======================================================================================#
// #			                    update user to be an admin                             #
// #=======================================================================================#
export const updateUserToBeAdmin = async (request: Request, response: Response, next: NextFunction) => {
    try {
        validateRequest(request)
        if ((request as any).user.is_admin !== true) throw new HttpError('you must be an admin', 403)

        const user = await User.findById(request.params.id).select(unreturnedData)
        if (!user) throw new HttpError(`No user with this id = ${request.params.id}`, 404)

        const UpdateUserData = await User.findByIdAndUpdate(request.params.id, { is_admin: request.body.is_admin }, { new: true }).select(unreturnedData);
        if (!UpdateUserData) throw new HttpError('can\'t update user to be an admin', 500)

        // add token
        const accessToken = createToken(UpdateUserData);

        response.status(200).json(returnUserData(UpdateUserData, accessToken));
    } catch (error: any) {
        console.error("\x1b[31m", 'auth-controller => updateUserToBeAdmin : ' + error.message, "\x1b[0m");
        next(error);
    }
}

// #=======================================================================================#
// #			                        update User                                        #
// #=======================================================================================#
export const updateUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
        validateRequest(request)
        if ((request as any).user.is_admin !== true) {
            if ((request as any).user.id !== request.params.id) throw new HttpError('you can\'t update this user data', 403)
        }

        const user = await User.findById(request.params.id).select(unreturnedData)
        if (!user) throw new HttpError(`No user with this id = ${request.params.id}`, 404)

        const userRequestData = {
            name: request?.body?.name,
            password: request?.body?.password ? hashPassword(request.body.password) : undefined,
            age: request?.body?.age,
            country: request?.body?.country,
            mobile: request?.body?.mobile
        }

        const UpdateUserData = await User.findByIdAndUpdate(request.params.id, userRequestData, { new: true }).select(unreturnedData);
        if (!UpdateUserData) throw new HttpError('can\'t update user', 500)

        // add token
        const accessToken = createToken(UpdateUserData)

        response.status(200).json(returnUserData(UpdateUserData, accessToken));
    } catch (error: any) {
        console.error("\x1b[31m", 'auth-controller => updateUser : ' + error.message, "\x1b[0m");
        next(error);
    }
}

// #=======================================================================================#
// #			                       delete User                                         #
// #=======================================================================================#
export const deleteUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
        validateRequest(request)
        if ((request as any).user.is_admin !== true) throw new HttpError('only admin can delete user', 403)

        const userData = await User.findByIdAndDelete(request.params.id).select(unreturnedData);
        if (!userData) throw new HttpError(`No user with this id = ${request.params.id}`, 404)

        response.status(200).json({ message: 'user deleted successfully' });
    } catch (error: any) {
        console.error("\x1b[31m", 'auth-controller => getAllUser : ' + error.message, "\x1b[0m");
        next(error);
    }
}

// #=======================================================================================#
// #			                          general fun                                      #
// #=======================================================================================#
function createToken(userData: any) {
    return jwt.sign({ id: userData._id, email: userData.email, is_admin: userData.is_admin || false }, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: 86400 //for 24 hour
    })
}

function hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
}

function returnUserData(userData: any, token?: string) {
    return {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        age: userData.age,
        country: userData.country,
        mobile: userData.mobile,
        is_admin: userData.is_admin,
        token
    }
}

function returnAllUserData(usersData: any[]) {
    return usersData.length > 0 ? usersData.map(user => returnUserData(user)) : []
}
