# Multi-stage Dockerfile that never drops root. Any RCE in the app runs
# as root inside the container. VC058 must fire.

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["node", "dist/server.js"]
