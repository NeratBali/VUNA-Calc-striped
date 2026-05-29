# Use a clean Node.js environment
FROM node:20-alpine

# Set the workspace directory inside the container
WORKDIR /app

# Copy configuration files and install runtime dependencies
COPY package*.json ./
RUN npm ci

# Copy all your calculator assets (HTML, CSS, JS, and server code)
COPY . .

# Expose network port 3000 for web traffic
EXPOSE 3000

# Fire up your new web server entry point
CMD ["node", "src/server.js"]