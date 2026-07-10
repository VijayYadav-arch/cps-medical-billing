# Testbed image for the CPS marketing site (static Astro build → nginx).
# Consumed by cps-dotnet/docker-compose.testbed.yml.
FROM node:20-alpine AS build
WORKDIR /app
# Build toolchain for native npm modules (e.g. better-sqlite3) — alpine has no
# prebuilt binaries, so node-gyp compiles from source. Build-stage only; the
# final nginx image stays slim.
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS final
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
