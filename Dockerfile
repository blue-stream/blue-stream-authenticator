FROM node:10.15-alpine
ENV NODE_ENV=development
ENV HOME=/usr/src/app
EXPOSE 8080
COPY package*.json $HOME
WORKDIR $HOME
RUN npm install --progress=false
COPY . $HOME

FROM node:10.15-alpine
ENV NODE_ENV=production
ENV HOME=/usr/src/app
EXPOSE 8080
WORKDIR $HOME
COPY --from=0 $HOME/package.json /$HOME/package-lock.json ./
COPY --from=0 $HOME/dist ./dist
RUN npm install
CMD ["npm", "start"]