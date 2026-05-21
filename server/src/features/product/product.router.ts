import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

import {
    createProductController,
    getProductsController,
    getProductByIdController,
    getProductsByEntrepreneurIdController,
    updateProductController,
    updateProductAvailabilityController,
    deleteProductController,
} from "./product.controller.js";

export const productRouter = Router();

//Create product
productRouter.post("/", authMiddleware, createProductController);

//Get all products
productRouter.get("/", getProductsController);

//Get all products by entrepreneur
productRouter.get("/entrepreneur/:entrepreneurId",getProductsByEntrepreneurIdController
);

//Get one product by id
productRouter.get("/:id", getProductByIdController);

//Update product
productRouter.patch("/:id", authMiddleware, updateProductController);

//Update product availability
productRouter.patch( "/:id/availability", authMiddleware, updateProductAvailabilityController
);

//Delete product
productRouter.delete("/:id", authMiddleware, deleteProductController);
