import Boom from "@hapi/boom";
import { pool } from "../../config/database.js";
import { ENTREPRENEUR_CATEGORIES } from "./ent.category.js";
import type {
  Entrepreneur,
  CreateEntrepreneurDTO,
  UpdateEntrepreneurDTO,
} from "./ent.types.js";

// get all entrepreneurs
export const getEntrepreneursService = async (): Promise<Entrepreneur[]> => {
  const query = `
    SELECT
      e.id,
      e.student_id,
      e.name,
      e.img,
      e.description,
      e.contact_info,
      e.category,
      e.campus_locations,
      e.entrepreneur_position,
      e.is_active,
      u.name AS owner_name
    FROM entrepreneurs e
    LEFT JOIN users u ON u.id = e.student_id
    ORDER BY e.name ASC
  `;

  const result = await pool.query(query);
  return result.rows;
};

// get entrepreneur by id
export const getEntrepreneurByIdService = async (
  entrepreneurId: string
): Promise<Entrepreneur> => {
  const query = `
    SELECT
      e.id,
      e.student_id,
      e.name,
      e.img,
      e.description,
      e.contact_info,
      e.category,
      e.campus_locations,
      e.entrepreneur_position,
      e.is_active,
      u.name AS owner_name
    FROM entrepreneurs e
    LEFT JOIN users u ON u.id = e.student_id
    WHERE e.id = $1
  `;

  const result = await pool.query(query, [entrepreneurId]);

  if (result.rows.length === 0) {
    throw Boom.notFound("Entrepreneur not found");
  }

  return result.rows[0];
};

// get entrepreneur by user id
export const getEntrepreneurByOwnerIdService = async (
  userId: string
): Promise<Entrepreneur> => {
  const query = `
    SELECT
      e.id,
      e.student_id,
      e.name,
      e.img,
      e.description,
      e.contact_info,
      e.category,
      e.campus_locations,
      e.entrepreneur_position,
      e.is_active,
      u.name AS owner_name
    FROM entrepreneurs e
    LEFT JOIN users u ON u.id = e.student_id
    WHERE e.student_id = $1
  `;

  const result = await pool.query(query, [userId]);

  if (result.rows.length === 0) {
    throw Boom.notFound("Entrepreneur not found for this user");
  }

  return result.rows[0];
};

// create entrepreneur
export const createEntrepreneurService = async (
  data: CreateEntrepreneurDTO
): Promise<Entrepreneur> => {
  if (!ENTREPRENEUR_CATEGORIES.includes(data.category)) {
    throw Boom.badRequest("Invalid entrepreneur category");
  }

  const query = `
    INSERT INTO entrepreneurs (
      student_id,
      name,
      img,
      description,
      contact_info,
      category,
      campus_locations,
      entrepreneur_position,
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
      campus_locations,
      entrepreneur_position,
      is_active
  `;

  const result = await pool.query(query, [
    data.student_id,
    data.name,
    data.img,
    data.description,
    data.contact_info,
    data.category,
    data.campus_locations,
    data.entrepreneur_position,
    true,
  ]);

  return result.rows[0];
};

// update entrepreneur
export const updateEntrepreneurService = async (
  entrepreneurId: string,
  data: UpdateEntrepreneurDTO
): Promise<Entrepreneur> => {
  const currentEntrepreneur = await getEntrepreneurByIdService(entrepreneurId);

  const updatedName = data.name ?? currentEntrepreneur.name;
  const updatedImg = data.img ?? currentEntrepreneur.img;
  const updatedDescription = data.description ?? currentEntrepreneur.description;
  const updatedContactInfo =
    data.contact_info ?? currentEntrepreneur.contact_info;
  const updatedCategory = data.category ?? currentEntrepreneur.category;
  const updatedCampusLocations =
    data.campus_locations ?? currentEntrepreneur.campus_locations;
  const updatedEntrepreneurPosition =
    data.entrepreneur_position ?? currentEntrepreneur.entrepreneur_position;

  if (data.category && !ENTREPRENEUR_CATEGORIES.includes(data.category)) {
    throw Boom.badRequest("Invalid entrepreneur category");
  }

  const query = `
    UPDATE entrepreneurs
    SET
      name = $1,
      img = $2,
      description = $3,
      contact_info = $4,
      category = $5,
      campus_locations = $6,
      entrepreneur_position = $7
    WHERE id = $8
    RETURNING
      id,
      student_id,
      name,
      img,
      description,
      contact_info,
      category,
      campus_locations,
      entrepreneur_position,
      is_active
  `;

  const result = await pool.query(query, [
    updatedName,
    updatedImg,
    updatedDescription,
    updatedContactInfo,
    updatedCategory,
    updatedCampusLocations,
    updatedEntrepreneurPosition,
    entrepreneurId,
  ]);

  return result.rows[0];
};

// update status open/closed
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
      campus_locations,
      entrepreneur_position,
      is_active
  `;

  const result = await pool.query(query, [isActive, entrepreneurId]);
  return result.rows[0];
};