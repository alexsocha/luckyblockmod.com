# === build ===
FROM node:10-alpine as build-client
WORKDIR /app

COPY ./client/package*.json ./client/
RUN cd client && npm ci

COPY ./docs/package*.json ./docs/
RUN cd docs && npm ci

# === run ===
FROM node:10-alpine as run-server
WORKDIR /app/server

COPY ./server/package*.json ./
RUN npm ci

EXPOSE 8080
