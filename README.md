# Northcoders News API

A News API.  Serves articles, comments, topics and users.

*Link to hosted version:* https://slurpy-nc-news.herokuapp.com/api

*Link to hosted front-end application:* https://slurpy-nc-news.netlify.app/

## Prerequisites
- Node.js `(^16.13.2)`
- npm `(^8.1.2)`

## Setup 
### Cloning and environment
- Click the green Code button, copy the HTTPS URL, then use `git clone [url]` in a terminal
- `cd BE-News`
- `npm install` to install dependencies
- `npm run seed` to seed the development database
- `npm test app` to seed test database and run integration tests, alternatively use `npm test` to run all tests 
### Environment variables
- Create two files, `.env.development` and `.env.test`
- Set the `PGDATABASE` environment variable for each file to the corresponding database name, found in `setup.sql`
- For reference, use `.env-example`



