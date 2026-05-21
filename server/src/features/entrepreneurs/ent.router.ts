import { Router } from "express";
import {
    createEntrepreneurController,
    createMyEntrepreneurController,
    getEntrepreneursController,
    getEntrepreneurByIdController,
    getEntrepreneurByOwnerIdController,
    getMyEntrepreneurController,
    updateMyEntrepreneurStatusController,
    updateEntrepreneurController,
    updateEntrepreneurStatusController,
} from "./ent.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

export const entrepreneurRouter = Router();

entrepreneurRouter.post("/", authMiddleware, createEntrepreneurController);
entrepreneurRouter.get("/", getEntrepreneursController);
entrepreneurRouter.get("/me", authMiddleware, getMyEntrepreneurController);
entrepreneurRouter.post("/me", authMiddleware, createMyEntrepreneurController);
entrepreneurRouter.patch("/me/status", authMiddleware, updateMyEntrepreneurStatusController);
entrepreneurRouter.get("/owner/:userId", getEntrepreneurByOwnerIdController);
entrepreneurRouter.get("/:id", getEntrepreneurByIdController);
entrepreneurRouter.patch("/:id", authMiddleware, updateEntrepreneurController);
entrepreneurRouter.patch("/:id/status", authMiddleware, updateEntrepreneurStatusController);
