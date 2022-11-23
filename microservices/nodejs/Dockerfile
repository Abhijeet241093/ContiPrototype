FROM node:16

ENV PORT 9112

WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm i
# run this for production
# npm ci --only=production

COPY . .

EXPOSE 9112

CMD [ "npm", "start" ]