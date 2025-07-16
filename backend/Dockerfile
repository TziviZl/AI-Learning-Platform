FROM node:20-alpine

RUN apk update && apk upgrade && apk add --no-cache ca-certificates

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

RUN npx prisma generate

RUN npm run build

EXPOSE 5000

CMD [ "node", "dist/app.js" ]
