import { Router } from "express";

import {
    createProductController,
    getProductsController,
    getProductByIdController,
    getProductsByEntrepreneurIdController,
    updateProductController,
    updateProductAvailabilityController,
    deleteProductController,
} from "./product.controller.js";

//TODO: Add auth middleware when auth module is ready

export const productRouter = Router();

//Create product
productRouter.post("/", createProductController);

//Get all products
productRouter.get("/", getProductsController);

//Get all products by entrepreneur
productRouter.get("/entrepreneur/:entrepreneurId",getProductsByEntrepreneurIdController
);

//Get one product by id
productRouter.get("/:id", getProductByIdController);

//Update product
productRouter.patch("/:id", updateProductController);

//Update product availability
productRouter.patch( "/:id/availability", updateProductAvailabilityController
);

//Delete product
productRouter.delete("/:id", deleteProductController);