# Project Title: NestJS Blog with Comments

## Description

This project is a RESTful API built with NestJS for managing blogs and comments. It includes user authentication, blog management with image uploads, and a comment system with nested replies.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Important Points](#important-points)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up the database:**

    - Ensure you have MongoDB installed and running.
    - Configure the MongoDB connection URI in the `.env` file. You may need to create this file in the root of your project. Example `.env` file:

      ```
      MONGODB_URI=mongodb://username:password@host:port/databaseName
      PORT=3000
      JWT_SECRET=yourSecretKey # Replace with a strong secret key
      ```

4.  **Run the application:**

    ```bash
    npm run start:dev
    ```

## Features

- User authentication using JWT.
- Blog management:
  - Create, read, update, and delete blogs.
  - Image upload for blogs.
- Comment system:
  - Create, read, update, and delete comments.
  - Nested replies to comments.
- Uses MongoDB for data persistence.

## Technologies Used

- NestJS
- MongoDB
- Mongoose
- JWT Authentication
- multer (for file uploads)
- class-validator
- @nestjs/config

## Prerequisites

- Node.js
- npm
- MongoDB

## Important Points

- **Authentication:** All routes for creating, updating, and deleting blogs and comments are protected with JWT authentication. Ensure you have a valid JWT token in the `Authorization` header when making these requests.
- **File Uploads:** Blog images are uploaded to the `uploads/blog-images/` directory. The server constructs the full URL to the image and stores it in the database. Ensure that your server can serve files from this directory.
- **Circular Dependencies:** The project uses `forwardRef()` to handle circular dependencies between the `BlogModule` and `CommentModule`.
- **Error Handling:** The application includes error handling for common scenarios such as invalid tokens, unauthorized access, and missing resources.
- **Validation:** Data transfer objects (DTOs) are used with `class-validator` to validate the request payload for creating and updating blogs and comments.
- **Environment Variables**: Use `.env` file to store sensitive information like database URI, port and JWT secret.
- **CORS**: Configure CORS settings if your frontend is on a different domain.

## License

[MIT](LICENSE)
