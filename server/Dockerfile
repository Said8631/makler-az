FROM node:18-alpine

WORKDIR /app

# İstilik paketlərini qur (SQLite üçün lazımdır)
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm install --production

COPY . .

# Uploads qovluğunu yarat
RUN mkdir -p uploads

EXPOSE 3000

CMD ["npm", "start"]
