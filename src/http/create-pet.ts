import type { FastifyInstance } from "fastify";

import { prisma } from "@/lib/prisma";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import z from "zod";

import { verifyJWT } from "./middlewares/verify-jwt";

export async function createPet(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post("/pets", {
        preHandler: verifyJWT,
        schema: {
            tags: ["Pets"],
            summary: "Create a new pet",
            body: z.object({
                name: z.string(),
                description: z.string(),
                species: z.string(),
                age: z.string(),
                energyLevel: z.string(),
                independenceLevel: z.string(),
                environment: z.string(),
                photos: z.array(z.string().url()),
                requirements: z.array(z.string())
            }),
            response: {
                201: z.object({
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
        const { orgId } = request.user.meta;

        const { name, description, species, age, energyLevel, independenceLevel, environment, photos, requirements } = request.body;

        const newPet = await prisma.pet.create({
            data: {
                name,
                description,
                species,
                age,
                energyLevel,
                independenceLevel,
                environment,
                
                orgId,

                pictures: {
                    create: photos.map(url => ({ url }))
                },

                requirements: {
                    create: requirements.map(title => ({ title }))
                }
            },

            include: {
                pictures: true,
                requirements: true
            }
        })

        const pet = {
            ...newPet,

            photos: newPet.pictures.map(picture => picture.url),
            requirements: newPet.requirements.map(requirement => requirement.title)
        }

        return reply.status(201).send({ pet });
    })
}