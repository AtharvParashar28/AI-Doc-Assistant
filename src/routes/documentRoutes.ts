import { Router } from "express";
import { CreateDocumentController, GetDocumentsController, GetDocumentbyID, UpdateDocumentController, DeleteDocumentController } from "../controllers/documentControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

const route = Router();

route.get('/documents', authMiddleware, GetDocumentsController);
route.post('/documents', authMiddleware, CreateDocumentController); 
route.get('/documents/:id', authMiddleware, GetDocumentbyID);
route.put('/documents/:id', authMiddleware, UpdateDocumentController);
route.delete('/documents/:id', authMiddleware, DeleteDocumentController);

export default route;