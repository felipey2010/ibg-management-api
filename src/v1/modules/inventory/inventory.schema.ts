import { z } from 'zod';
import { item_condition } from '../../../generated/enums.js';

const condition = [
  item_condition.NEW,
  item_condition.GOOD,
  item_condition.FAIR,
  item_condition.DAMAGED,
  item_condition.UNUSABLE,
] as const;

export const createInventoryItemSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    category_id: z.string().uuid().optional(),
    storage_location_id: z.string().uuid().optional(),
    quantity: z.number().min(0).optional(),
    minimum_quantity: z.number().min(0).optional(),
    unit: z.string().min(1),
    condition: z.enum(condition).optional(),
    is_active: z.boolean().optional(),
  }),
});
export const updateInventoryItemSchema = z.object({
  body: createInventoryItemSchema.shape.body.partial(),
});
