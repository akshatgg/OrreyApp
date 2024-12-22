# Use an official Node.js image as a base
FROM node

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json separately
COPY package.json ./          
COPY package-lock.json ./     

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the application (if applicable)
#RUN npm run build

# Expose the port on which your app will run
EXPOSE 8051

# Command to run your application
CMD ["npm","start", "--", "--host"]