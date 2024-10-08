import type { FastifyInstance } from "fastify";

import { prisma } from "@/lib/prisma";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import z from "zod";

export async function createPet(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post("/pets", {
        schema: {
            body: z.object({
                name: z.string(),
                description: z.string(),
                species: z.string(),
                age: z.string(),
                energy_level: z.string(),
                independence_level: z.string(),
                environment: z.string(),
                photos: z.array(z.string().url()),
                requirements: z.array(z.string())
            })
        }
    }, async (request, reply) => {
        const { orgId } = request.user.meta;

        const { name, description, species, age, energy_level, independence_level, environment, photos, requirements } = request.body;

        const pet = await prisma.pet.create({
            data: {
                name,
                description,
                species,
                age,
                energy_level,
                independence_level,
                environment,
                
                org_id: orgId,

                pictures: {
                    create: photos.map(url => ({ url }))
                },

                requirements: {
                    create: requirements.map(title => ({ title }))
                }
            }
        })

        return reply.status(201).send({ pet });
    })
}