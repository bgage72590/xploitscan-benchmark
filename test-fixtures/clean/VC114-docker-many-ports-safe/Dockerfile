FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src
COPY tsconfig.json ./
RUN npm run build

# Only the HTTP port; websockets are upgraded on the same server
EXPOSE 3000

USER node

CMD ["node", "dist/server.js"]
