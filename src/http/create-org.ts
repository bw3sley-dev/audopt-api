import { FastifyInstance } from "fastify";

import z from "zod";

import { prisma } from "../lib/prisma";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import { hash } from "bcryptjs";

import { ClientError } from "@/errors/client-error";

export async function createOrg(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post("/orgs", {
        schema: {
            tags: ["Auth"],
            summary: "Create a new organization/account",
            body: z.object({
                name: z.string(),
                ownerName: z.string(),
                email: z.string().email(),
                password: z.string().min(8, "Field should have 8 digits"),
                phone: z.string(),
                postalCode: z.string().min(8, "Field should have 8 digits").max(8, "Field should have 8 digits"),
                street: z.string(),
                coordinateX: z.string(),
                coordinateY: z.string()
            }),
            response: {
                201: z.object({
                    orgId: z.string()
                })
            }
        }
    }, async (request, reply) => {
        const { name, ownerName, email, password, phone, postalCode, street, coordinateX, coordinateY } = request.body;

        const doesOrgExist = await prisma.org.findUnique({
            where: {
                email
            }
        })

        if (doesOrgExist) {
            throw new ClientError("Organization already exists.");
        }

        const hashedPassword = await hash(password, 6);

        const org = await prisma.org.create({
            data: {
                name,
                ownerName,
                email,
                password: hashedPassword,
                phone,
                postalCode,
                street,
                coordinateX,
                coordinateY
            }
        })

        return reply.status(201).send({ orgId: org.id })
    })
}