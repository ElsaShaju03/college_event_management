# 1. Use the same Node.js base
FROM node:18-alpine

# 2. Create the app folder
WORKDIR /app

# 3. Copy library lists
COPY package*.json ./

# 4. Install libraries
RUN npm install

# 5. Copy your backend code
COPY . .

# 6. Create the 'uploads' folder so images have a home inside the box
RUN mkdir -p uploads

# 7. Open 'Gate 5000' for the API
EXPOSE 5000

# 8. Start the server
CMD ["npm", "start"]