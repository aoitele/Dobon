FROM node:12

# アプリケーションディレクトリを作成
WORKDIR /usr/src/app

# 依存関係をインストール (package.json, packeage-lock.json)
COPY package*.json ./

RUN npm install

# アプリケーションソースをバンドル
COPY . .

# アプリケーションを実行するコマンド定義
EXPOSE 8080
CMD ["node", "server.js"]