import { Router } from "express";
import {
    createEntrepreneurController,
    getEntrepreneursController,
    getEntrepreneurByIdController,
    getEntrepreneurByOwnerIdController,
    updateEntrepreneurController,
    updateEntrepreneurStatusController,
} from "./ent.controller.js";

//TODO: Add auth middleware when auth module is ready

export const entrepreneurRouter = Router();

entrepreneurRouter.post("/", createEntrepreneurController);
entrepreneurRouter.get("/", getEntrepreneursController);
entrepreneurRouter.get("/owner/:userId", getEntrepreneurByOwnerIdController);
entrepreneurRouter.get("/:id", getEntrepreneurByIdController);
entrepreneurRouter.patch("/:id", updateEntrepreneurController);
entrepreneurRouter.patch("/:id/status", updateEntrepreneurStatusController);