FROM node:10.15-alpine

ENV NODE_ENV=testing

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install

RUN npm install -g mocha

COPY . .

EXPOSE 8080

CMD ["npm", "run", "test"]