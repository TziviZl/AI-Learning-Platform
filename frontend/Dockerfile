FROM node:20-alpine AS build-stage

WORKDIR /app

ARG VITE_API_URL

ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine AS production-stage

RUN apk add --no-cache gettext 

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY ./nginx.conf.template /etc/nginx/conf.d/default.conf.template

COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 5173
