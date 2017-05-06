FROM mhart/alpine-node:latest
run mkdir /app
add main.js /app/main.js
cmd node /app/main.js
