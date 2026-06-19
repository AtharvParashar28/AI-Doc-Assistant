import { Router } from "express";
import { CreateDocumentController, GetDocumentsController, GetDocumentbyID, UpdateDocumentController, DeleteDocumentController } from "../controllers/documentControllers";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/inputValidation.middleware";
import { getDocumentsQuerySchema, getDocumentsParamSchema } from "../validators/document.validator";
import { ValidationSource } from "../middlewares/inputValidation.middleware";


const route = Router();

export const SOURCE = {
    query : "query",
    body : "body",
    params : "params"
}

route.get('/documents', authMiddleware, validate(getDocumentsQuerySchema, SOURCE.query as ValidationSource),GetDocumentsController);
route.post('/documents', authMiddleware,CreateDocumentController); 
route.get('/documents/:id', authMiddleware, validate(getDocumentsParamSchema, SOURCE.params as ValidationSource), GetDocumentbyID);
route.put('/documents/:id', authMiddleware, validate(getDocumentsParamSchema, SOURCE.params as ValidationSource), UpdateDocumentController);
route.delete('/documents/:id', authMiddleware, validate(getDocumentsParamSchema, SOURCE.params as ValidationSource), DeleteDocumentController);

export default route;