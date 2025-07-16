FROM node:20-alpine

ARG DATABASE_URL

ENV DATABASE_URL=${DATABASE_URL}

RUN apk update && apk upgrade && apk add --no-cache ca-certificates

WORKDIR /app

COPY package*.json ./

RUN npm install --frozen-lockfile 

COPY . .

RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npx ts-node src/scripts/createAdmin.ts 
RUN npx ts-node src/scripts/seed.ts      

RUN npm run build

EXPOSE 10000 

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

CMD [ "node", "dist/app.js" ]