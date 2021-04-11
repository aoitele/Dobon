FROM node:14.16.0-buster-slim

ENV NODE_ENV=production

# アプリケーションソースをバンドル
COPY /api /usr/src/api
WORKDIR /usr/src/api

# for prisma openssl
RUN apt-get -qy update \
  && apt-get -qy install openssl

RUN npm install && npm run tsc && npm run prisma:generate

CMD [ "npm", "start" ]