import { Router } from "express";
import { createDocument, deleteDocumentById, documentById, updateDocumentById, documents } from "../controllers/documentControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

const route = Router();

route.get('/documents', authMiddleware, documents);
route.post('/documents', authMiddleware, createDocument); 
route.get('/documents/:id', authMiddleware, documentById);
route.put('/documents/:id', authMiddleware, updateDocumentById);
route.delete('/documents/:id', authMiddleware, deleteDocumentById);

export default route;