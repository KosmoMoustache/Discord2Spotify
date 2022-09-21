FROM node:16

RUN npm install -g pnpm

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm --prod install

COPY . .

ENTRYPOINT ["/bin/sh", "./docker-entrypoint.sh"]

EXPOSE 8080