# Contact Manager

A full-stack contact manager built with React, Express, and MongoDB.

## Features

- Create, edit, search, and delete contacts
- Import contacts from CSV or JSON
- Download ready-to-use JSON template files from the import modal
- Find and remove duplicate contacts by phone number

## Contact Import Template

The import modal now includes two template download buttons:

- `Download Empty Template` downloads a JSON file with one blank contact object
- `Download Template With 100 Records` downloads a JSON file with 100 sample contacts

Each contact in the JSON template uses this structure:

```json
[
  {
    "name": "Contact 0000001",
    "email": "contact0000001@example.com",
    "phone": "9000000000"
  }
]
```

Required fields:

- `name`
- `email`
- `phone`

The importer accepts both `.csv` and `.json` files.

## Project Structure

```text
backend/
  config/
  controllers/
  models/
  routes/
client/
  public/
  src/
```

## Run Locally

### 1. Install dependencies

At the project root:

```bash
npm install
```

Inside the client app:

```bash
cd client
npm install
```

### 2. Start the backend

From the project root:

```bash
npm start
```

### 3. Start the frontend

From the `client` folder:

```bash
npm start
```

## Backend API Notes

Main contacts endpoints:

- `GET /api/contacts`
- `POST /api/contacts`
- `POST /api/contacts/upload`
- `GET /api/contacts/template-json?count=0`
- `GET /api/contacts/template-json?count=100`
- `GET /api/contacts/handle-duplicates`

## Tech Stack

- React
- Express
- MongoDB with Mongoose
- Tailwind CSS
- Axios
