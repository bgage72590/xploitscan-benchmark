# Pipe-to-shell install — if the upstream is ever compromised, every build
# pulls attacker code with no integrity check. VC189 must fire.
FROM node:20-slim

WORKDIR /app

# Multi-line RUN with curl|sh — this is the dangerous pattern.
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://example.com/install.sh | sh \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

CMD ["node", "server.js"]
