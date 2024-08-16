FROM node:20.14

# Set the working directory inside the container
WORKDIR /usr/src/app/src

# Copy only the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the working directory
COPY src/ ./

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]