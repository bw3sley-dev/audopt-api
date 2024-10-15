import { ClientError } from "@/errors/client-error";

import { prisma } from "@/lib/prisma";

import type { FastifyInstance } from "fastify";

import type { ZodTypeProvider } from "fastify-type-provider-zod";

import z from "zod";

import { verifyJWT } from "./middlewares/verify-jwt";

export async function getPet(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get("/pets/:id", {
        preHandler: verifyJWT,
        schema: {
            tags: ["Pets"],
            summary: "Get details from pet",
            params: z.object({
                id: z.string().uuid()
            }),
            response: {
                200: z.object({
                    pet: z.object({
                        id: z.string(),
                        name: z.string(),
                        description: z.string(),
                        species: z.string(),
                        age: z.string(),
                        energyLevel: z.string(),
                        independenceLevel: z.string(),
                        environment: z.string(),
                        photos: z.array(z.string().url()),
                        requirements: z.array(z.string()),
                        createdAt: z.date(),
                        deletedAt: z.date().nullable(),
                        orgId: z.string()
                    })
                })
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;

        const pet = await prisma.pet.findUnique({
            where: {
                id
            },

            include: {
                pictures: true,
                requirements: true
            }
        })

        if (!pet) {
            throw new ClientError("Pet not found.");
        }

        const _pet = {
            ...pet,

            photos: pet.pictures.map(picture => picture.url),
            requirements: pet.requirements.map(requirement => requirement.title)
        }

        return reply.send({ pet: _pet });
    })
}