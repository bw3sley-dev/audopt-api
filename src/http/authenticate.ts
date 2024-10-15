import type { FastifyInstance } from "fastify";

import z from "zod";

import { prisma } from "../lib/prisma";

import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { ClientError } from "@/errors/client-error";

import { compare } from "bcryptjs";

export async function authenticate(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post("/sessions", {
        schema: {
            tags: ["Auth"],
            summary: "Authenticate with e-mail and password",
            body: z.object({
                email: z.string().email(),
                password: z.string()
            }),
            response: {
                201: z.object({
                    token: z.string()
                })
            }
        }
    }, async (request, reply) => {
        const { email, password } = request.body;

        const org = await prisma.org.findUnique({
            where: {
                email
            }
        })

        if (!org) {
            throw new ClientError("Invalid credentials");
        }

        const doesPasswordMatch = await compare(password, org.password);

        if (!doesPasswordMatch) {
            throw new ClientError("Invalid credentials");
        }

        const token = await reply.jwtSign(
            {
                sub: org.id
            },

            {
                sign: {
                    expiresIn: "7d",
                },
            }
        )

        return reply.status(201).send({ token })
    })
}