FROM node:latest
WORKDIR /usr/libquality/
COPY . /usr/libquality/
RUN npm install pm2 -g \
    && npm install
CMD ["npm", "run", "start:dev"]