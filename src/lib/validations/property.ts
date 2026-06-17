import { z } from "zod"

export const PropertyFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(1, "Price must be greater than 0"),
  type: z.enum(["apartment", "house", "villa", "commercial", "land"], {
    message: "Select a valid property type",
  }),
  purpose: z.enum(["buy", "rent"], {
    message: "Select buy or rent",
  }),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  area_sqft: z.number().min(1, "Area must be greater than 0"),
  furnishing_status: z.enum(["furnished", "semi-furnished", "unfurnished"]),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip_code: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  features: z.array(z.string()),
  property_age: z.number().min(0),
  is_luxury: z.boolean(),
  is_new_project: z.boolean(),
  is_featured: z.boolean(),
})

export type PropertyFormValues = z.infer<typeof PropertyFormSchema>
