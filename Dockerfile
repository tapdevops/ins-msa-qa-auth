FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json /usr/src/app

RUN npm install -g nodemon
RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . /usr/src/app

EXPOSE 3008
//CMD [ "npm", "start" ]
CMD [ "nodemon", "app.js" ]
CMD [ "rs" ]

#RUN npm install
#RUN node  app.js