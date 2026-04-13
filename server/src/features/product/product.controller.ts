import type { Request, Response } from "express";
import Boom from "@hapi/boom";

import {
    createProductService,
    getProductsService,
    getProductByIdService,
    getProductsByEntrepreneurIdService,
    updateProductService,
    updateProductAvailabilityService,
    deleteProductService,
} from "./product.service.js";

//TODO: Add auth middleware when auth module is ready

//Create product
export const createProductController = async (
    req: Request,
    res: Response
) => {
    if (!req.body) {
        throw Boom.badRequest("Request body is required");
    }

    const product = await createProductService(req.body);
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

    const updatedProduct = await updateProductService(id, req.body);
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

    const updatedAvailability = await updateProductAvailabilityService(
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

    const deletedProduct = await deleteProductService(id);
    return res.json(deletedProduct);
};