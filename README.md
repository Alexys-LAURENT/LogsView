# Prerequisites :

- Volta (https://volta.sh/)

# Install project in local

## 1. Clone the repo

```bash
git clone
```

## 2. Create a .env file by copying the .env.example file

```bash
# REMEMBER : When adding a new environment variable, you must add it to the the start/env.ts file and the .env.example


TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=
NODE_ENV=development
SESSION_DRIVER=cookie

# Path to the db.sqlite3 file (db automatically created if not exists by migrations)
# This folder must be ignored by git
DB_PATH="./tmp/"

# One chance out of X to delete logs afterSave
DATABASE_PURGE_PROBABILITY= 100

# While remove logs older than X months
DATABASE_RETENTION_MONTHS= 6

# Default number of logs to display per page when 'perPage' field is not provided
DEFAULT_LOGS_COUNT_PER_PAGE= 25

# ADMIN USER CREDENTIALS FOR SEEDING (set password not hashed, its automatically hashed)
# Only the password will be needed to login
ADMIN_EMAIL=admin@mail.com
ADMIN_PASSWORD=changeme


```

## 3. Install the dependencies

> ⚠️ The project uses React 19 and at this time (21-03-2025) all the dependencies are not compatible with React 19. To install the dependencies, you must use the `--legacy-peer-deps` flag.

```bash
npm install --legacy-peer-deps
```

> ℹ️ : At the end of the installation the `postinstall` script will be executed in order to create the database folder referenced in the .env file, if it does not exist.

## 4. Create the database by running the migrations

```bash
node ace migration:run
```

# Build the project for production

### 1

```bash
npm run build
```

> ⚠️ : The .env and db folder are not copied to the build folder. You must copy them manually if needed.

### 2

```bash
cd build
```

### 3

> ⚠️ The project uses React 19 and at this time (21-03-2025) all the dependencies are not compatible with React 19. To install the dependencies, you must use the `--legacy-peer-deps` flag.

```bash
npm ci --omit="dev" --legacy-peer-deps
```

### 4

```bash
npm run start
#equivalent to `node bin/server.js`
```

## Important information from Adonis JS documentation :

### Avoiding GZip Interference

When deploying applications that use @adonisjs/transmit, it’s important to ensure that GZip compression does not interfere with the text/event-stream content type used by Server-Sent Events (SSE). Compression applied to text/event-stream can cause connection issues, leading to frequent disconnects or SSE failures.

If your deployment uses a reverse proxy (such as **Traefik** or **Nginx**) or other middleware that applies GZip, ensure that compression is disabled for the text/event-stream content type.

Example Configuration for Traefik :

```yaml
traefik.http.middlewares.gzip.compress=true
traefik.http.middlewares.gzip.compress.excludedcontenttypes=text/event-stream
traefik.http.routers.my-router.middlewares=gzip
```

# How to send log

```js
fetch("http://localhost:3333/api/logs", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    idHost: "b7f73709-a321-48a5-9a8f-deb9226908ea" // Use a unique identifier (uuid) for the host that will send the logs,
    content: "Hello world" //longText,
    type: "info", //info, error, success
    additional: "Hello world", //longText, additional information, nullable,
    group: "test", //group name, used to group logs of multiple hosts, nullable
  }),
});
```
