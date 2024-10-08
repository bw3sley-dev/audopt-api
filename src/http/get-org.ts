import { ClientError } from "@/errors/client-error";

import { prisma } from "@/lib/prisma";

import type { FastifyInstance } from "fastify";

import type { ZodTypeProvider } from "fastify-type-provider-zod";

import z from "zod";

export async function getOrg(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get("/orgs/:id", {
        schema: {
            params: z.object({
                id: z.string()
            })
        }
    }, async (request, reply) => {
        const { id } = request.params;

        const org = await prisma.org.findUnique({
            where: {
                id
            }
        })

        if (!org) {
            return new ClientError("Organization not found.");
        }

        return reply.send({ org });
    })
}