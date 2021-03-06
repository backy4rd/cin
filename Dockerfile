FROM node:12-alpine
WORKDIR /api
RUN apk add ffmpeg
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build
CMD ["npm", "start"]
