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

//TODO: Add auth middleware when auth module is ready

export const entrepreneurRouter = Router();

entrepreneurRouter.post("/", createEntrepreneurController);
entrepreneurRouter.get("/", getEntrepreneursController);
entrepreneurRouter.get("/me", authMiddleware, getMyEntrepreneurController);
entrepreneurRouter.post("/me", authMiddleware, createMyEntrepreneurController);
entrepreneurRouter.patch("/me/status", authMiddleware, updateMyEntrepreneurStatusController);
entrepreneurRouter.get("/owner/:userId", getEntrepreneurByOwnerIdController);
entrepreneurRouter.get("/:id", getEntrepreneurByIdController);
entrepreneurRouter.patch("/:id", updateEntrepreneurController);
entrepreneurRouter.patch("/:id/status", updateEntrepreneurStatusController);
