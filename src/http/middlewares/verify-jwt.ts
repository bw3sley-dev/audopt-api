import type { FastifyRequest, FastifyReply } from "fastify";

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
    try {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            return reply.status(401).send({ code: "UNAUTHORIZED", message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];

        request.user = request.server.jwt.verify(token);
    }

    catch (error) {
        return reply.status(401).send({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }
}