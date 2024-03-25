###################
# BUILD STAGE
###################
# This stage installs all dependencies, including 'devDependencies', and builds your NestJS application.
FROM node:18-alpine as build

# Create app directory
WORKDIR /usr/src/app

# Copies package.json and package-lock.json (if available) to Docker environment
COPY package*.json ./

# Installs all dependencies
RUN npm install

# Copies everything over to Docker environment
COPY . .

# Builds the app for production
RUN npm run build

###################
# PRODUCTION STAGE
###################
# This stage sets up the production environment and copies the build artifacts from the 'build' stage above
FROM node:18-alpine as production

# Sets NODE_ENV environment variable
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# Copies package.json and package-lock.json (if available)
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copies built assets from the 'build' stage
COPY --from=build /usr/src/app/dist ./dist

# Use the node user from the image (instead of the root user) for security
USER node

# The application's default port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]
