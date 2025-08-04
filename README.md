# LuckyDraw Backend – Node.js + GraphQL + PostgreSQL

A clean, modular backend to manage players and user roles for a **lucky draw / leaderboard** application.  
Built with **Node.js**, **Express**, **Apollo Server (GraphQL)**, **PostgreSQL**, fully unit‑tested with **Jest**, and designed to be scalable & maintainable.

- GraphQL API (Queries & Mutations)
- Centralized Validation & Custom Errors
- Modular Service Layer & Models
- Unit Testing with >90% Coverage
- Leaderboard & Player Management
- Role‑based Access (Admin / Guest)

---

## Key Features

| Feature                  | Description                                                                                 |
|-------------------------|---------------------------------------------------------------------------------------------|
| **GraphQL API**         | Unified endpoint to query and mutate data (`/graphql`)                                       |
| **Players CRUD**        | Add, update, delete players; validate name, id & score                                       |
| **Leaderboard**         | Fetch top 10 players ranked by score                                                         |
| **User Role Fetching**  | Get user roles from DB (e.g., admin vs guest)                                                |
| **Central Validation**  | Validate inputs & return clear BAD_USER_INPUT errors                                         |
| **Custom Errors**       | Consistent GraphQL errors with codes (NOT_FOUND, INTERNAL_SERVER_ERROR)                      |
| **Logging Service**     | Central log utility: info, warn, error                                                       |
| **Unit Testing**        | Jest tests for services & resolvers; covers success & failure scenarios                      |

---

## ⚙️ Tech Stack

- **Backend Framework**: Node.js + Express
- **API Layer**: Apollo Server (GraphQL)
- **Database**: PostgreSQL
- **Testing**: Jest
- **Architecture**: Modular services + models + validation layer
- **Logging & Errors**: Custom logger & GraphQL error helper

---

## Folder Structure

api/
 ├─ resolvers.js         → GraphQL resolvers (queries & mutations)
 └─ typeDefs.js          → GraphQL schema (Player, User, Query, Mutation)
common/
 ├─ errorService.js      → Create GraphQL errors with codes
 ├─ loggerService.js     → Central logging utility
 └─ validationService.js → Validate name, score, id
config/
 └─ db-config.js         → PostgreSQL connection pool
models/
 ├─ player.js            → Player model
 └─ user.js              → User model
services/
 ├─ playerService.js     → CRUD + leaderboard logic
 └─ userService.js       → Get user role logic
tests/
 ├─ resolvers.spec.js    → Tests for resolvers
 ├─ playerService.spec.js→ Tests for player service
 └─ userService.spec.js  → Tests for user service
app.js                   → Express + Apollo Server entry point

##  Database Schema (PostgreSQL) - Create these tables before running the app:

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE user_roles (
  user_id INT REFERENCES users(id),
  role_id INT REFERENCES roles(id),
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  title VARCHAR(100),
  score INT NOT NULL DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INT REFERENCES users(id)
);
## Roles & Permissions

| Role  | Capabilities                           |
| ----- | -------------------------------------- |
| Admin | View all players, add, update, delete  |
| Guest | View only top 10 players (leaderboard) |

## Why This Project?
- GraphQL-first architecture
- Modular services, models & validation layer
- Custom error handling with detailed codes
- Role-based design (Admin / Guest)
- Fully unit-tested with mocked DB & logs
- Clean, documented DB schema

## Installation & Run
download server/luckydraw
cd luckydraw
npm install

## Configure DB
- Update PostgreSQL credentials in: config/db-config.js

## Start server
- node server.js

## Testing
-- npm test - run unit test

## What's Next?
- Add pagination & filters
- Add JWT auth & middleware
- Deploy as lambda in AWS




