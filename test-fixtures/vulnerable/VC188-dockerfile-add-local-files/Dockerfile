# Express API image
FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /usr/src/app

# Install dependencies first so Docker can cache this layer
ADD package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the rest of the app source
ADD --chown=node:node . .

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:3000/health || exit 1
CMD ["node", "src/server.js"]
