import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../models/ApiResponse";
import { createUser, loginUser, getUsers } from "../services/createUser";
import { HTTP_STATUS_CODE, ERROR_MESSAGES, RESPONSE_STATUS, SUCCESS_MESSAGES } from "../constants/statusCode";

export async function userController(req : Request, res : Response<ApiResponse>, next : NextFunction){
    
    const users = await getUsers();

    return res.status(HTTP_STATUS_CODE.OK).json(
        {
        status : RESPONSE_STATUS.SUCCESS,
        message : SUCCESS_MESSAGES.OPERATION_SUCCESS,
        data : users
    }
    ) 
    
}