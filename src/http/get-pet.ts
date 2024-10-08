import { ClientError } from "@/errors/client-error";

import { prisma } from "@/lib/prisma";

import type { FastifyInstance } from "fastify";

import type { ZodTypeProvider } from "fastify-type-provider-zod";

import z from "zod";

export async function getPet(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get("/pets/:id", {
        schema: {
            params: z.object({
                id: z.string().uuid()
            })
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
            return new ClientError("Pet not found.");
        }

        return reply.send({ pet });
    })
}