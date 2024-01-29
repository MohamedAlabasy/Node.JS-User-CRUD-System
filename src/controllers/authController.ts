import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import validateRequest from '../utilities/validateRequest';
import User from '../models/userSchema';
import { HttpError } from '../utilities/HttpError';

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
        const accessToken = jwt.sign({ id: userData._id, email: userData.email, is_admin: userData.is_admin }, process.env.ACCESS_TOKEN_SECRET as string, {
            expiresIn: 86400 //for 24 hour
        });

        // add token to db
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
            is_admin: false,
        })
        const userData = await user.save();

        response.status(200).json(returnUserData(userData))

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
        if (!userData) throw new HttpError(`No user with this id = ${request.params._id}`, 404)

        response.status(200).json(returnUserData(userData));
    } catch (error: any) {
        console.error("\x1b[31m", 'auth-controller => getUserDataByID : ' + error.message, "\x1b[0m");
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
        if (userData.length > 0) {
            response.status(200).json(returnAllUserData(userData));
        }

        response.status(200).json(returnUserData(userData));
    } catch (error: any) {
        console.error("\x1b[31m", 'auth-controller => getAllUser : ' + error.message, "\x1b[0m");
        next(error);
    }
}

// #=======================================================================================#
// #			                          general fun                                      #
// #=======================================================================================#
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
        token
    }
}

function returnAllUserData(usersData: any[]) {
    return usersData.length > 0 ? usersData.map(user => returnUserData(user)) : []
}
