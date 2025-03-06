
# Semesta GYM API

[API Documentation](https://documenter.getpostman.com/view/18242897/2sAYQgfnT2)


## Installation

- Clone repository
- Go to file
- Copy .env.example to .env
```bash
  cp .env.example .env
```
- Install with npm

```bash
  npm install
```
    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV` development/test/production

`MAIL_HOST`
`MAIL_PORT`
`MAIL_USER`
`MAIL_PASSWORD`
`MAIL_FROM`

## Setting Database
go to ```config/config.json``` setting valiable 
```
"username": "",
"password": ,
"database": "",
"host": "",
"dialect": "mysql"
```

## Seed Data
seeding data
```bash
npx sequelize-cli db:seed:all
```
## Run
```bash
  npm run dev
```
