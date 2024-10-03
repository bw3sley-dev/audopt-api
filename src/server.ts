import fastify from "fastify";

import cors from "@fastify/cors";

import jwt from "@fastify/jwt";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

import { errorHandler } from "./error-handler";

import { authenticate } from "./http/authenticate";
import { createOrg } from "./http/create-org";

import { env } from "./env";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler)

app.register(cors, {
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],

    origin: "*",
})

app.register(jwt, {
    secret: env.JWT_SECRET,

    cookie: {
        cookieName: "auth",
        signed: false
    }
})

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "",
            description: "",
            version: ""
        },

        servers: []
    },

    transform: jsonSchemaTransform
})

app.register(authenticate);
app.register(createOrg);

app.register(fastifySwaggerUI, {
    routePrefix: "/reference"
})

app.listen({
    host: "0.0.0.0",
    port: env.PORT
}).then(() => console.log(`🔥 HTTP server running at localhost:${env.PORT}`))