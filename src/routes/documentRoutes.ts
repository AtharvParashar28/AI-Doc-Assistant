import { Router } from "express";
import { CreateDocumentController, deleteDocumentController, documentById, updateDocumentById, documents } from "../controllers/documentControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

const route = Router();

route.get('/documents', authMiddleware, documents);
route.post('/documents', authMiddleware, CreateDocumentController); 
route.get('/documents/:id', authMiddleware, documentById);
route.put('/documents/:id', authMiddleware, updateDocumentById);
route.delete('/documents/:id', authMiddleware, deleteDocumentController);

export default route;