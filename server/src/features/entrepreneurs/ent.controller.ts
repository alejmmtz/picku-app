import type { Request, Response } from "express";
import Boom from "@hapi/boom";
import {
    createEntrepreneurService,
    getEntrepreneursService,
    getEntrepreneurByIdService,
    getEntrepreneurByOwnerIdService,
    updateEntrepreneurService,
    updateEntrepreneurStatusService,
} from "./ent.service.js";

//TODO: Add auth middleware when auth module is ready

//create entrepreneur
export const createEntrepreneurController = async (
    req: Request,
    res: Response
) => {
    if (!req.body) {
        throw Boom.badRequest("Request body is required");
    }

    const entrepreneur = await createEntrepreneurService(req.body);
    return res.status(201).json(entrepreneur);
};

//get all entrepreneurs
export const getEntrepreneursController = async (
    req: Request,
    res: Response
) => {
    const entrepreneurs = await getEntrepreneursService();
    return res.json(entrepreneurs);
};

//get entrepreneur by id
export const getEntrepreneurByIdController = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;

    const entrepreneur = await getEntrepreneurByIdService(id);
    return res.json(entrepreneur);
};

//get entrepreneur by owner userId
export const getEntrepreneurByOwnerIdController = async (
    req: Request<{ userId: string }>,
    res: Response
) => {
    const { userId } = req.params;

    const entrepreneur = await getEntrepreneurByOwnerIdService(userId);
    return res.json(entrepreneur);
};

//update entrepreneur
export const updateEntrepreneurController = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;

    if (!req.body) {
        throw Boom.badRequest("Request body is required");
    }

    const updatedEntrepreneur = await updateEntrepreneurService(id, req.body);
    return res.json(updatedEntrepreneur);
};

//update entrepreneur status (open/closed)
export const updateEntrepreneurStatusController = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;

    if (req.body?.is_active === undefined) {
        throw Boom.badRequest("is_active is required");
    }

    const updatedStatus = await updateEntrepreneurStatusService(
        id,
        req.body.is_active
    );

    return res.json(updatedStatus);
};