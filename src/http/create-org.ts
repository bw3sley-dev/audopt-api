import { FastifyInstance } from "fastify";

import z from "zod";

import { prisma } from "../lib/prisma";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { hash } from "bcryptjs";

import { ClientError } from "@/errors/client-error";

export async function createOrg(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post("/create-org", {
        schema: {
            body: z.object({
                name: z.string(),
                owner_name: z.string(),
                email: z.string().email(),
                password: z.string().min(8, "Field should have 8 digits"),
                phone: z.string(),
                postal_code: z.string().min(8, "Field should have 8 digits").max(8, "Field should have 8 digits"),
                street: z.string(),
                coordinate_x: z.string(),
                coordinate_y: z.string()
            })
        }
    }, async (request, reply) => {
        const { name, owner_name, email, password, phone, postal_code, street, coordinate_x, coordinate_y } = request.body;

        const doesOrgExist = await prisma.org.findUnique({
            where: {
                email
            }
        })

        if (doesOrgExist) {
            return new ClientError("Organization already exists.");
        }

        const hashedPassword = await hash(password, 6);

        const org = await prisma.org.create({
            data: {
                name,
                owner_name,
                email,
                password: hashedPassword,
                phone,
                postal_code,
                street,
                coordinate_x,
                coordinate_y
            }
        })

        return reply.status(201).send({ org_id: org.id })
    })
}