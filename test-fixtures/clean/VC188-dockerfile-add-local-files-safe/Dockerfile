# Express API image
FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /usr/src/app

# tini as PID 1 — one of ADD's legitimate uses: a pinned, checksummed URL fetch
ADD --checksum=sha256:c5b0666b4cb676901f90dfcb37106783c5fe2077b04590973b885950611b30ee --chmod=755 \
    https://github.com/krallin/tini/releases/download/v0.19.0/tini-static /sbin/tini

# Install dependencies first so Docker can cache this layer
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the rest of the app source
COPY --chown=node:node . .

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:3000/health || exit 1
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/server.js"]
