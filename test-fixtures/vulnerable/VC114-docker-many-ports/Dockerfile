FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src
COPY tsconfig.json ./
RUN npm run build

# App server, websocket server, Prisma Studio and the Node inspector
EXPOSE 3000 3001 5555 9229

USER node

CMD ["node", "--inspect=0.0.0.0:9229", "dist/server.js"]
