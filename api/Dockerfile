FROM node:12

# アプリケーションディレクトリを作成
WORKDIR /usr/src

# 依存関係をインストール (package.json, packeage-lock.json)
COPY ./api/package*.json ./

# アプリケーションソースをバンドル
COPY ./api ./usr/src/api

WORKDIR /usr/src/api
RUN npm install

# アプリケーションを実行するコマンド定義
EXPOSE 8080
CMD npm run dev-api