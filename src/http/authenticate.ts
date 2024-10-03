import type { FastifyInstance } from "fastify";

import z from "zod";

import { prisma } from "../lib/prisma";

import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { ClientError } from "@/errors/client-error";

import { compare } from "bcryptjs";

export async function authenticate(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post("/sessions", {
        schema: {
            body: z.object({
                email: z.string().email(),
                password: z.string().min(6, "Field should have 8 digits"),
            })
        }
    }, async (request, reply) => {
        const { email, password } = request.body;

        const org = await prisma.org.findUnique({
            where: {
                email
            }
        })

        if (!org) {
            return new ClientError("Invalid credentials");
        }

        const doesPasswordMatch = await compare(password, org.password);

        if (!doesPasswordMatch) {
            return new ClientError("Invalid credentials");
        }

        const token = await reply.jwtSign(
            {
                sub: org.id
            },

            {
                expiresIn: "7d"
            }
        )

        return reply.send({ token })
    })
}