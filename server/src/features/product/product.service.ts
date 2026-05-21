import Boom from "@hapi/boom";
import { pool } from "../../config/database.js";
import type {
    Product,
    CreateProductDTO,
    UpdateProductDTO,
} from "./product.types.js";

const getEntrepreneurIdByOwnerId = async (userId: string): Promise<string> => {
    const result = await pool.query<{ id: string }>(
        `
            SELECT id
            FROM entrepreneurs
            WHERE student_id = $1
        `,
        [userId]
    );

    const entrepreneurId = result.rows[0]?.id;

    if (!entrepreneurId) {
        throw Boom.notFound("Entrepreneur not found for this user");
    }

    return entrepreneurId;
};

const ensureProductOwnership = async (
    productId: string,
    ownerId: string
): Promise<Product> => {
    const product = await getProductByIdService(productId);
    const entrepreneurId = await getEntrepreneurIdByOwnerId(ownerId);

    if (product.entrepreneur_id !== entrepreneurId) {
        throw Boom.forbidden("You can only manage your own products");
    }

    return product;
};

//Get all products
export const getProductsService = async (): Promise<Product[]> => {
    const query = `
        SELECT
            id,
            entrepreneur_id,
            name,
            price,
            description,
            category,
            img,
            is_available
        FROM products
        ORDER BY name ASC
    `;

    const result = await pool.query(query);
    return result.rows;
};

//Get product by id
export const getProductByIdService = async (
    productId: string
): Promise<Product> => {
    const query = `
        SELECT
            id,
            entrepreneur_id,
            name,
            price,
            description,
            category,
            img,
            is_available
        FROM products
        WHERE id = $1
    `;

    const result = await pool.query(query, [productId]);

    if (result.rows.length === 0) {
        throw Boom.notFound("Product not found");
    }

    return result.rows[0];
};

//Get all products that belong to one entrepreneur
export const getProductsByEntrepreneurIdService = async (
    entrepreneurId: string
): Promise<Product[]> => {
    const query = `
        SELECT
            id,
            entrepreneur_id,
            name,
            price,
            description,
            category,
            img,
            is_available
        FROM products
        WHERE entrepreneur_id = $1
        ORDER BY name ASC
    `;

    const result = await pool.query(query, [entrepreneurId]);
    return result.rows;
};

//Create a new product
export const createProductService = async (
    data: CreateProductDTO
): Promise<Product> => {
    //Check if the entrepreneur exists before inserting the product
    const checkEntrepreneurQuery = `
        SELECT id
        FROM entrepreneurs
        WHERE id = $1
    `;

    const checkEntrepreneurResult = await pool.query(checkEntrepreneurQuery, [
        data.entrepreneur_id,
    ]);

    if (checkEntrepreneurResult.rows.length === 0) {
        throw Boom.notFound("Entrepreneur not found");
    }

    const query = `
        INSERT INTO products (
            entrepreneur_id,
            name,
            price,
            description,
            category,
            img,
            is_available
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
            id,
            entrepreneur_id,
            name,
            price,
            description,
            category,
            img,
            is_available
    `;

    const result = await pool.query(query, [
        data.entrepreneur_id,
        data.name,
        data.price,
        data.description,
        data.category,
        data.img,
        true,
    ]);

    return result.rows[0];
};

export const createProductForOwnerService = async (
    ownerId: string,
    data: Omit<CreateProductDTO, "entrepreneur_id">
): Promise<Product> => {
    const entrepreneurId = await getEntrepreneurIdByOwnerId(ownerId);

    return createProductService({
        entrepreneur_id: entrepreneurId,
        ...data,
    });
};

//Update an existing product
export const updateProductService = async (
    productId: string,
    data: UpdateProductDTO
): Promise<Product> => {
    const currentProduct = await getProductByIdService(productId);

    const updatedName = data.name ?? currentProduct.name;
    const updatedPrice = data.price ?? currentProduct.price;
    const updatedDescription = data.description ?? currentProduct.description;
    const updatedCategory = data.category ?? currentProduct.category;
    const updatedImg = data.img ?? currentProduct.img;

    const query = `
        UPDATE products
        SET
            name = $1,
            price = $2,
            description = $3,
            category = $4,
            img = $5
        WHERE id = $6
        RETURNING
            id,
            entrepreneur_id,
            name,
            price,
            description,
            category,
            img,
            is_available
    `;

    const result = await pool.query(query, [
        updatedName,
        updatedPrice,
        updatedDescription,
        updatedCategory,
        updatedImg,
        productId,
    ]);

    return result.rows[0];
};

export const updateOwnedProductService = async (
    ownerId: string,
    productId: string,
    data: UpdateProductDTO
): Promise<Product> => {
    await ensureProductOwnership(productId, ownerId);
    return updateProductService(productId, data);
};

//Update product availability
export const updateProductAvailabilityService = async (
    productId: string,
    isAvailable: boolean
): Promise<Product> => {
    await getProductByIdService(productId);

    const query = `
        UPDATE products
        SET is_available = $1
        WHERE id = $2
        RETURNING
            id,
            entrepreneur_id,
            name,
            price,
            description,
            category,
            img,
            is_available
    `;

    const result = await pool.query(query, [isAvailable, productId]);
    return result.rows[0];
};

export const updateOwnedProductAvailabilityService = async (
    ownerId: string,
    productId: string,
    isAvailable: boolean
): Promise<Product> => {
    await ensureProductOwnership(productId, ownerId);
    return updateProductAvailabilityService(productId, isAvailable);
};

//Delete product by id
export const deleteProductService = async (
    productId: string
): Promise<Product> => {
    const existingProduct = await getProductByIdService(productId);

    const query = `
        DELETE FROM products
        WHERE id = $1
        RETURNING
            id,
            entrepreneur_id,
            name,
            price,
            description,
            category,
            img,
            is_available
    `;

    const result = await pool.query(query, [productId]);

    return result.rows[0] ?? existingProduct;
};

export const deleteOwnedProductService = async (
    ownerId: string,
    productId: string
): Promise<Product> => {
    await ensureProductOwnership(productId, ownerId);
    return deleteProductService(productId);
};
