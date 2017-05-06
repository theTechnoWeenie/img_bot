FROM mhart/alpine-node:latest
run mkdir /app
add main.js /app/main.js
expose 3000
cmd node /app/main.js
