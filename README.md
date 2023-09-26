# Ise Course REST API 🇳🇬

## Description

An API for That allows a user to view and create courses

## Table of Contents

-   [Features](#features)
-   [Quick run](#quick-run)
-   [Comfortable development](#comfortable-development)
-   [Links](#links)
-   [Automatic update of dependencies](#automatic-update-of-dependencies)
-   [Database utils](#database-utils)
-   [Tests](#tests)

## Features

-   [x] Database ([typeorm](https://www.npmjs.com/package/typeorm)).
-   [x] Docker.
-   [x] Units tests
-   [x] Caching(Redis)

## Quick run

Run the application with docker

```bash
docker-compose up
```

## Comfortable development

### - Install dependencies

```bash
npm install
```

### - Environment Configuration

`config` read all environment variables from `.env` files.

Copy the `.env.example` file to `.env` and edit it, with your own values.

```bash
cp .example.env .env

```

### - To run the application in development mode with `npm run start:dev`

### - To run the application as a docker container

```bash
docker-compose up
```

### - To re-build the application docker image

```bash
docker-compose up --build
```


