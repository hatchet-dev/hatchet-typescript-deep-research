# Use the official Node.js image.
FROM node:22

# Install pnpm
RUN npm install -g pnpm@9.15.4

# Create app directory
WORKDIR /usr/src/app

# Copy the entire monorepo
COPY . .

# Install dependencies and build
RUN cd hatchet-worker && \
    pnpm install && \
    pnpm build

# Expose the port the app runs on
EXPOSE 8080

# Define the command to run the app
CMD [ "node", "hatchet-worker/dist/worker.js" ]