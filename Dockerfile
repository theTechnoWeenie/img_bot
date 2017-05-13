FROM mhart/alpine-node:latest
RUN mkdir /app
RUN mkdir /app/sources
RUN mkdir /app/images
ADD main.js /app/main.js
ADD *.json /app/
ADD sources /app/sources/
ADD images /app/images/
RUN cd /app/ && npm install
EXPOSE 3000
CMD node /app/main.js
