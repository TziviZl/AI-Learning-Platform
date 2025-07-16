FROM node:20-alpine as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html


EXPOSE 5173 # Expose the port Nginx will listen on (adjust if your frontend runs on a different port)

CMD ["nginx", "-g", "daemon off;"]
