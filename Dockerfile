# === build ===
FROM node:10-alpine as build
WORKDIR /app

COPY . .

RUN cd server && npm ci
RUN cd client && npm ci
RUN cd docs && npm ci

RUN npm run build

# === run ===
FROM node:10-alpine as run-server
WORKDIR /app

COPY --from=build /app/server/dist /app/server/dist
COPY --from=build /app/server/node_modules /app/server/node_modules
COPY --from=build /app/client/dist /app/client/dist
COPY --from=build /app/docs/dist /app/docs/dist
COPY package.json .

EXPOSE 8080
CMD ["npm", "run", "start-cluster"]
