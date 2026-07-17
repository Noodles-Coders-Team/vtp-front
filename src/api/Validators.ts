import { z } from "zod";


export function validateSchema<T>(Schema: z.ZodType, body: any): T {
    // Validate the form data using the Schema
    const result = Schema.safeParse(body);

    if (!result.success) {
        console.error(result.error);
        throw new Error(`Invalid data: ${result.error}`);
    }

    return result.data as T;
}

export function validateSchemaArray<T>(Schema: z.ZodType, body: any): T{
    const result = Schema.array().safeParse(body);

    if (!result.success) {
        console.error(result.error);
        throw new Error(`Invalid data: ${result.error}`);
    }

    return result.data as T;
}