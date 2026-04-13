import Boom from "@hapi/boom";
import { pool } from "../../config/database.js";
import type {
    Entrepreneur,
    CreateEntrepreneurDTO,
    UpdateEntrepreneurDTO,
} from "./ent.types.js";

//get all entrepreneur
export const getEntrepreneursService = async (): Promise<Entrepreneur[]> => {
    const query = `
        SELECT
            id,
            student_id,
            name,
            img,
            description,
            contact_info,
            category,
            latitude,
            longitude,
            is_active
        FROM entrepreneurs
        ORDER BY name ASC
    `;

    const result = await pool.query(query);
    return result.rows;
};

//get entrepreneur by id (only one)
export const getEntrepreneurByIdService = async (
    entrepreneurId: string
): Promise<Entrepreneur> => {
    const query = `
        SELECT
            id,
            student_id,
            name,
            img,
            description,
            contact_info,
            category,
            latitude,
            longitude,
            is_active
        FROM entrepreneurs
        WHERE id = $1
    `;

    const result = await pool.query(query, [entrepreneurId]);

    if (result.rows.length === 0) {
        throw Boom.notFound("Entrepreneur not found");
    }

    return result.rows[0];
};

//get entrepreneur userId (owner of the entrepreneur)
export const getEntrepreneurByOwnerIdService = async (
    userId: string
): Promise<Entrepreneur> => {
    const query = `
        SELECT
            id,
            student_id,
            name,
            img,
            description,
            contact_info,
            category,
            latitude,
            longitude,
            is_active
        FROM entrepreneurs
        WHERE student_id = $1
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
        throw Boom.notFound("Entrepreneur not found for this user");
    }

    return result.rows[0];
};

//create entrepreneur (default active = open)
export const createEntrepreneurService = async (
    data: CreateEntrepreneurDTO
): Promise<Entrepreneur> => {
    const query = `
        INSERT INTO entrepreneurs (
            student_id,
            name,
            img,
            description,
            contact_info,
            category,
            latitude,
            longitude,
            is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING
            id,
            student_id,
            name,
            img,
            description,
            contact_info,
            category,
            latitude,
            longitude,
            is_active
    `;

    const result = await pool.query(query, [
        data.student_id,
        data.name,
        data.img,
        data.description,
        data.contact_info,
        data.category,
        data.latitude,
        data.longitude,
        true,
    ]);

    return result.rows[0];
};

//update or edit entrepreneur
export const updateEntrepreneurService = async (
    entrepreneurId: string,
    data: UpdateEntrepreneurDTO
): Promise<Entrepreneur> => {
    const currentEntrepreneur = await getEntrepreneurByIdService(entrepreneurId);

    const updatedName = data.name ?? currentEntrepreneur.name;
    const updatedImg = data.img ?? currentEntrepreneur.img;
    const updatedDescription = data.description ?? currentEntrepreneur.description;
    const updatedContactInfo = data.contact_info ?? currentEntrepreneur.contact_info;
    const updatedCategory = data.category ?? currentEntrepreneur.category;
    const updatedLatitude = data.latitude ?? currentEntrepreneur.latitude;
    const updatedLongitude = data.longitude ?? currentEntrepreneur.longitude;

    const query = `
        UPDATE entrepreneurs
        SET
            name = $1,
            img = $2,
            description = $3,
            contact_info = $4,
            category = $5,
            latitude = $6,
            longitude = $7
        WHERE id = $8
        RETURNING
            id,
            student_id,
            name,
            img,
            description,
            contact_info,
            category,
            latitude,
            longitude,
            is_active
    `;

    const result = await pool.query(query, [
        updatedName,
        updatedImg,
        updatedDescription,
        updatedContactInfo,
        updatedCategory,
        updatedLatitude,
        updatedLongitude,
        entrepreneurId,
    ]);

    return result.rows[0];
};

//update status open/closed
export const updateEntrepreneurStatusService = async (
    entrepreneurId: string,
    isActive: boolean
): Promise<Entrepreneur> => {
    await getEntrepreneurByIdService(entrepreneurId);

    const query = `
        UPDATE entrepreneurs
        SET is_active = $1
        WHERE id = $2
        RETURNING
            id,
            student_id,
            name,
            img,
            description,
            contact_info,
            category,
            latitude,
            longitude,
            is_active
    `;

    const result = await pool.query(query, [isActive, entrepreneurId]);
    return result.rows[0];
};