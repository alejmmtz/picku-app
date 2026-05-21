import type { Request, Response } from "express";
import Boom from "@hapi/boom";
import {
    createEntrepreneurService,
    getEntrepreneursService,
    getEntrepreneurByIdService,
    getEntrepreneurByOwnerIdService,
    getRequiredEntrepreneurByOwnerIdService,
    updateEntrepreneurService,
    updateEntrepreneurStatusService,
} from "./ent.service.js";
 
const requireEntrepreneurUser = (req: Request): string => {
    if (!req.authUser) {
        throw Boom.unauthorized("Authenticated user was not found");
    }

    if (req.authUser.role !== "entrepreneur") {
        throw Boom.forbidden("Only entrepreneurs can manage business profiles");
    }

    return req.authUser.id;
};

//create entrepreneur
export const createEntrepreneurController = async (
    req: Request,
    res: Response
) => {
    if (!req.body) {
        throw Boom.badRequest("Request body is required");
    }

    const ownerId = requireEntrepreneurUser(req);
    const entrepreneur = await createEntrepreneurService({
        student_id: ownerId,
        name: req.body.name,
        img: req.body.img,
        description: req.body.description,
        contact_info: req.body.contact_info,
        category: req.body.category,
    });
    return res.status(201).json(entrepreneur);
};

export const createMyEntrepreneurController = async (
    req: Request,
    res: Response
) => {
    const ownerId = requireEntrepreneurUser(req);

    const entrepreneur = await createEntrepreneurService({
        student_id: ownerId,
        name: req.body.name,
        img: req.body.img,
        description: req.body.description,
        contact_info: req.body.contact_info,
        category: req.body.category,
    });

    return res.status(201).json(entrepreneur);
};

export const getMyEntrepreneurController = async (
    req: Request,
    res: Response
) => {
    if (!req.authUser) {
        throw Boom.unauthorized("Authenticated user was not found");
    }

    const entrepreneur = await getRequiredEntrepreneurByOwnerIdService(req.authUser.id);
    return res.json(entrepreneur);
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

    const entrepreneur = await getRequiredEntrepreneurByOwnerIdService(userId);
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

    const ownerId = requireEntrepreneurUser(req);
    const currentEntrepreneur = await getRequiredEntrepreneurByOwnerIdService(ownerId);

    if (currentEntrepreneur.id !== id) {
        throw Boom.forbidden("You can only update your own entrepreneur profile");
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

    const ownerId = requireEntrepreneurUser(req);
    const currentEntrepreneur = await getRequiredEntrepreneurByOwnerIdService(ownerId);

    if (currentEntrepreneur.id !== id) {
        throw Boom.forbidden("You can only update your own entrepreneur profile");
    }

    const updatedStatus = await updateEntrepreneurStatusService(
        id,
        req.body.is_active
    );

    return res.json(updatedStatus);
};

export const updateMyEntrepreneurStatusController = async (
    req: Request,
    res: Response
) => {
    const ownerId = requireEntrepreneurUser(req);

    if (req.body?.is_active === undefined) {
        throw Boom.badRequest("is_active is required");
    }

    const entrepreneur = await getRequiredEntrepreneurByOwnerIdService(ownerId);
    const updatedStatus = await updateEntrepreneurStatusService(
        entrepreneur.id,
        req.body.is_active
    );

    return res.json(updatedStatus);
};
