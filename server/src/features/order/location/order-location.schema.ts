import { z } from 'zod';

import { isKnownCampusLocationId } from './campus-locations.js';

const LATITUDE_MIN = -90;
const LATITUDE_MAX = 90;
const LONGITUDE_MIN = -180;
const LONGITUDE_MAX = 180;

export const coordinatesSchema = z.object({
  latitude: z
    .number()
    .min(LATITUDE_MIN, 'Latitude must be between -90 and 90')
    .max(LATITUDE_MAX, 'Latitude must be between -90 and 90'),
  longitude: z
    .number()
    .min(LONGITUDE_MIN, 'Longitude must be between -180 and 180')
    .max(LONGITUDE_MAX, 'Longitude must be between -180 and 180'),
});

export const geoJsonPointSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([
    z.number().min(LONGITUDE_MIN).max(LONGITUDE_MAX),
    z.number().min(LATITUDE_MIN).max(LATITUDE_MAX),
  ]),
});

export const geoPointInputSchema = z.union([
  coordinatesSchema,
  geoJsonPointSchema,
]);

export const campusLocationIdSchema = z.coerce
  .number()
  .int()
  .positive('campus_location_id must be a positive integer');

export const consumerOrderLocationBaseSchema = z.object({
  user_position: coordinatesSchema,
  campus_location_id: campusLocationIdSchema.optional(),
});

const campusLocationRefinement = (
  body: { campus_location_id?: number | undefined },
  context: z.RefinementCtx
) => {
  if (
    body.campus_location_id !== undefined &&
    !isKnownCampusLocationId(body.campus_location_id)
  ) {
    context.addIssue({
      code: 'custom',
      message:
        'campus_location_id is not a known campus location (mock catalog)',
      path: ['campus_location_id'],
    });
  }
};

export const consumerOrderLocationBodySchema =
  consumerOrderLocationBaseSchema.superRefine(campusLocationRefinement);

export const saveConsumerOrderLocationBodySchema =
  consumerOrderLocationBaseSchema
    .extend({
      order_id: z.coerce.number().int().positive(),
    })
    .superRefine(campusLocationRefinement);

export const saveConsumerOrderLocationSchema = z.object({
  body: saveConsumerOrderLocationBodySchema,
  params: z.object({}),
  query: z.object({}),
});

export const entrepreneurLocationUpdateSchema = z.object({
  position: coordinatesSchema,
  captured_at: z.iso.datetime({ offset: true }).optional(),
  accuracy_meters: z.number().positive().max(500).optional(),
});

export const entrepreneurLocationBurstBodySchema = z.object({
  order_id: z.coerce.number().int().positive(),
  updates: z
    .array(entrepreneurLocationUpdateSchema)
    .min(1, 'At least one location update is required')
    .max(50, 'Too many updates in a single burst'),
});

export const entrepreneurLocationBurstSchema = z.object({
  body: entrepreneurLocationBurstBodySchema,
  params: z.object({}),
  query: z.object({}),
});

export const orderLocationByIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  query: z.object({}),
});

export const postOrderLocationTrackingBodySchema = z.object({
  updates: entrepreneurLocationBurstBodySchema.shape.updates,
});

export const postOrderLocationTrackingSchema = z.object({
  body: postOrderLocationTrackingBodySchema,
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  query: z.object({}),
});

export type CoordinatesInput = z.infer<typeof coordinatesSchema>;
export type ConsumerOrderLocationBody = z.infer<
  typeof consumerOrderLocationBodySchema
>;
export type SaveConsumerOrderLocationBody = z.infer<
  typeof saveConsumerOrderLocationBodySchema
>;
export type EntrepreneurLocationBurstBody = z.infer<
  typeof entrepreneurLocationBurstBodySchema
>;
