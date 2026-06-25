# 1. Use a lightweight version of Node.js as the base
FROM node:18-alpine

# 2. Create a folder named 'app' inside the box
WORKDIR /app

# 3. Copy the list of libraries (package.json) first
COPY package*.json ./

# 4. Install those libraries inside the box
RUN npm install

# 5. Copy all your project files into the box
COPY . .

# 6. Open 'Gate 3000' so we can see the website
EXPOSE 3000

# 7. The command to start the website when the box opens
CMD ["npm", "start"]