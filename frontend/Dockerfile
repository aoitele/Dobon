# ビルド環境
FROM node:12
# アプリケーションディレクトリを作成
WORKDIR /usr/src

# 依存関係をインストール (package.json, packeage-lock.json)
COPY ./frontend/package*.json ./

# アプリケーションソースをバンドル
COPY ./frontend ./frontend

WORKDIR /usr/src/frontend
RUN npm install

# アプリケーションを実行するコマンド定義
EXPOSE 3000
CMD npm run start
