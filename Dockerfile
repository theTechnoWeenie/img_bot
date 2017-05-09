FROM mhart/alpine-node:latest
RUN mkdir /app
RUN mkdir /app/sources
ADD main.js /app/main.js
ADD *.json /app/
ADD sources /app/sources/
RUN cd /app/ && npm install
EXPOSE 3000
CMD node /app/main.js
