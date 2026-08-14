import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../models/ErrorResponse";
import { customError } from "../models/customError";

export function globalErrors(err : customError, req : Request, res : Response<ErrorResponse>, next : NextFunction){
    console.log(err.name, err.message, err.statusCode)
    res.status(err.statusCode || 400).json({
        status : "Failed",
        message : err.message
    })
}
