# Hatchet Worker Monorepo

This monorepo contains a Hatchet worker implementation using TypeScript.

## Building and Running with Docker

### Prerequisites
- Docker installed on your machine
- Node.js 22 or later (for local development)

### Building the Docker Image

From the root of the monorepo directory, run:

```bash
docker build -t hatchet-worker .
```

This will create a Docker image named `hatchet-worker` using the Dockerfile in this directory.

### Running the Container

To run the worker container:

```bash
docker run hatchet-worker
```

This will:
- Start the worker container
- Map port 8080 from the container to your host machine
- Run the worker process

### Environment Variables

If you need to configure the worker with environment variables, you can pass them using the `-e` flag:

```bash
docker run \
  -e HATCHET_CLIENT_TOKEN=your_token \
  -e OTHER_ENV_VAR=value \
  hatchet-worker
```