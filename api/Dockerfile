FROM node:14.16.0-buster-slim

# アプリケーションソースをバンドル
COPY ./api ./usr/src/api
WORKDIR /usr/src/api

RUN npm install

# アプリケーションを実行するコマンド定義
EXPOSE 8080
CMD npm run dev-api