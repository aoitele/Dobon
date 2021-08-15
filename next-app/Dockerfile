FROM node:14.16.0-buster-slim
ENV HOST 0.0.0.0

RUN apt-get update && apt-get install -y \
    curl \
    # for prisma openssl
    openssl 

WORKDIR /usr/src/next-app
COPY package*.json /usr/src/next-app/
RUN npm install

COPY . /usr/src/next-app/
RUN npm run prisma:generate

EXPOSE 3000