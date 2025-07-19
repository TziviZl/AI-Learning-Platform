FROM node:20-alpine

ARG DATABASE_URL

ENV DATABASE_URL=${DATABASE_URL}

RUN apk update && apk upgrade && apk add --no-cache ca-certificates

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

RUN cp src/favicon.ico dist/favicon.ico

EXPOSE 5000 

CMD [ "node", "dist/app.js" ]