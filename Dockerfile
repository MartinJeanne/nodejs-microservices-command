FROM node:21-slim
WORKDIR /usr/src/app

# dependencies installation
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

# Code
COPY src src

# Run the bot
CMD ["npm", "start"]