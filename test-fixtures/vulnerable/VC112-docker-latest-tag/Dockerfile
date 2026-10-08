# Build the Vite + React frontend and serve it with nginx
FROM node:latest as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY src ./src
COPY public ./public
COPY index.html vite.config.ts tsconfig.json ./
RUN npm run build

# Production image
FROM nginx

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
