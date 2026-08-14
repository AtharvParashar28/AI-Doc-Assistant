import z from "zod";

export const generateSchema = z.object({
  content: z.string().min(1, "Content is required"),
}).strict();

export const getChatParamsSchema = z.object({
  id : z.uuid("Must be a valid chat id")
})
