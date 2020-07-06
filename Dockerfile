FROM node:10-alpine as luckyblock-website
WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci

EXPOSE 8080
