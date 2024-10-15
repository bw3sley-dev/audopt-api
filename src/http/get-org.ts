import { ClientError } from "@/errors/client-error";

import { prisma } from "@/lib/prisma";

import type { FastifyInstance } from "fastify";

import type { ZodTypeProvider } from "fastify-type-provider-zod";

import z from "zod";

import { verifyJWT } from "./middlewares/verify-jwt";

export async function getOrg(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get("/orgs/:id", {
        preHandler: verifyJWT,
        schema: {
            tags: ["Organizations"],
            summary: "Get details from organization",
            params: z.object({
                id: z.string()
            }),
            response: {
                200: z.object({
                    org: z.object({
                        id: z.string(),
                        name: z.string(),
                        ownerName: z.string(),
                        email: z.string(),
                        phone: z.string(),
                        street: z.string(),
                        coordinateX: z.string(),
                        coordinateY: z.string(),
                        createdAt: z.date()                    
                    })
                })
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;

        const org = await prisma.org.findUnique({
            where: {
                id
            },

            select: {
                id: true,
                name: true,
                ownerName: true,
                email: true,
                phone: true,
                street: true,
                coordinateX: true,
                coordinateY: true,
                createdAt: true
            }
        })

        if (!org) {
            throw new ClientError("Organization not found.");
        }

        return reply.send({ org });
    })
}