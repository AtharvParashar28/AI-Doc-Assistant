import z from "zod";

export const getDocumentsQuerySchema = z
.object({
  page: z.coerce
    .number()
    .int("Page must be an integer")
    .min(1, "Page must be greater than 0")
    .default(1),

  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .min(1, "Limit must be greater than 0")
    .max(100, "Limit cannot exceed 100")
    .default(10),

  search: z.string().trim().optional(),

    sortBy: z
    .enum(["createdAt", "updatedAt", "fileName"])
    .default("createdAt"),

  sortOrder: z
    .enum(["asc", "desc"])
    .default("desc"),
}).refine(
    (data) => !(data.sortOrder && !data.sortBy),
    {
      message: "sortBy is required when sortOrder is provided",
      path: ["sortOrder"],
    }
  );


export const getDocumentsParamSchema = z.object({
  id : z.uuid("Must be a valid document id")
})

