import type { Request, Response } from "express";
import Boom from "@hapi/boom";

import {
    createProductService,
    createProductForOwnerService,
    getProductsService,
    getProductByIdService,
    getProductsByEntrepreneurIdService,
    updateProductService,
    updateOwnedProductService,
    updateProductAvailabilityService,
    updateOwnedProductAvailabilityService,
    deleteProductService,
    deleteOwnedProductService,
} from "./product.service.js";
 
const requireEntrepreneurUser = (req: Request): string => {
    if (!req.authUser) {
        throw Boom.unauthorized("Authenticated user was not found");
    }

    if (req.authUser.role !== "entrepreneur") {
        throw Boom.forbidden("Only entrepreneurs can manage products");
    }

    return req.authUser.id;
};

//Create product
export const createProductController = async (
    req: Request,
    res: Response
) => {
    if (!req.body) {
        throw Boom.badRequest("Request body is required");
    }

    const ownerId = requireEntrepreneurUser(req);
    const product = await createProductForOwnerService(ownerId, req.body);
    return res.status(201).json(product);
};

//Get all products
export const getProductsController = async (
    req: Request,
    res: Response
) => {
    const products = await getProductsService();
    return res.json(products);
};

//Get product by id
export const getProductByIdController = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;

    const product = await getProductByIdService(id);
    return res.json(product);
};

//Get products by entrepreneur id
export const getProductsByEntrepreneurIdController = async (
    req: Request<{ entrepreneurId: string }>,
    res: Response
) => {
    const { entrepreneurId } = req.params;

    const products = await getProductsByEntrepreneurIdService(entrepreneurId);
    return res.json(products);
};

//Update product
export const updateProductController = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;

    if (!req.body) {
        throw Boom.badRequest("Request body is required");
    }

    const ownerId = requireEntrepreneurUser(req);
    const updatedProduct = await updateOwnedProductService(ownerId, id, req.body);
    return res.json(updatedProduct);
};

//Update product availability
export const updateProductAvailabilityController = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;

    if (req.body?.is_available === undefined) {
        throw Boom.badRequest("is_available is required");
    }

    const ownerId = requireEntrepreneurUser(req);
    const updatedAvailability = await updateOwnedProductAvailabilityService(
        ownerId,
        id,
        req.body.is_available
    );

    return res.json(updatedAvailability);
};

//Delete product
export const deleteProductController = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;
    const ownerId = requireEntrepreneurUser(req);
    const deletedProduct = await deleteOwnedProductService(ownerId, id);
    return res.json(deletedProduct);
};
