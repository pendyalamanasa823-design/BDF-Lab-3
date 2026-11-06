# Backend Development Fundamentals – Lab 3
## REST API Development using Node.js, Express.js and SQLite

### Student Details

- **Name:** Pendyala Manasa
- **Registration Number:** 252U1R1191
- **Section:** CSE-2D
- **Course:** Backend Development Fundamentals-3

---

## Live Application
- **Live Application URL:** https://bdf-lab-3-er43.onrender.com/
- **GitHub Repository:** https://github.com/pendyalamanasa823-design/BDF-Lab-3

---

## 1. Project Description

This project focuses on developing a RESTful API for managing a collection of books using Node.js, Express.js and SQLite.

The application supports CRUD operations (Create, Read, Update and Delete), query parameters, input validation and error handling.

It also demonstrates how to retrieve books using search functionality, sorting, pagination and price-range filtering.

## 2. Technologies Used

- **Node.js:** JavaScript runtime environment.
- **Express.js:** Framework for building REST APIs.
- **SQLite:** Lightweight relational database.
- **sqlite3:** SQLite database driver.
- **sqlite:** Promise-based interface for SQLite.
- **Postman:** API testing and validation.
- **Git and GitHub:** Version control and source-code management.
- **Render:** Application deployment platform.

## 3. Project Structure

```text
BDF-Lab-3/
│
├── app.js
├── package.json
├── package-lock.json
├── README.md
│
├── database/
│   └── books.db
│
├── setup-db.js
├── seed-storybooks.js
└── check-db.js
```

## 4. Installation and Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/pendyalamanasa823-design/BDF-Lab-3.git
```

### Step 2: Navigate to the Project Folder

```bash
cd BDF-Lab-3
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start the Application

```bash
npm start
```

The application runs locally at:

```text
http://localhost:3000/
```

## 5. Database Structure

The project uses an SQLite database named `books.db`.

The `book` table contains the following columns:

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key with auto-increment |
| title | TEXT | Book title |
| author | TEXT | Book author |
| price | INTEGER | Book price |
| pages | INTEGER | Number of pages |

The database is initialized and populated using the database setup and seed scripts.

## 6. API Endpoints

### A. GET – Retrieve All Books
Retrieves the list of books from the database.

**Query Parameters:**

| Parameter | Description |
|---|---|
| search_q | Search books by partial title |
| order_by | Sort records using a selected field |
| order | Sort order: ASC or DESC |
| limit | Maximum number of records |
| offset | Number of records to skip |
| min_price | Minimum book price |
| max_price | Maximum book price |

**Example:**

https://bdf-lab-3-er43.onrender.com/books/?search_q=potter&order_by=price&order=ASC&limit=10&offset=0

Updates the details of an existing book using its ID.

**Example JSON Request:**

```json
{
  "title": "The Alchemist - Updated",
  "author": "Paulo Coelho",
  "price": 300,
  "pages": 220
}
```

Successful updates return status code `200 OK`.

If the specified book does not exist, the API returns `404 Not Found`.

### E. DELETE – Delete a Book

```http
DELETE /books/1/
```

Deletes the book with the specified ID.

Successful deletion returns status code `200 OK`.

If the book does not exist, the API returns `404 Not Found`.

## 7. Query Parameters and Filtering

The GET `/books/` endpoint supports:

- **Search:** Finds books using partial title matching with SQL `LIKE`.
- **Sorting:** Sorts books in ascending or descending order.
- **Pagination:** Uses `limit` and `offset` to retrieve records in smaller groups.
- **Price Filtering:** Retrieves books within a specified minimum and maximum price range.

**Example Requests:**

https://bdf-lab-3-er43.onrender.com/books/?search_q=the

https://bdf-lab-3-er43.onrender.com/books/?order_by=price&order=DESC

https://bdf-lab-3-er43.onrender.com/books/?limit=10&offset=0

https://bdf-lab-3-er43.onrender.com/books/?min_price=100&max_price=500

## 8. Testing

The API endpoints were tested using Postman and a web browser.

The testing process includes:

- Retrieving all books.
- Retrieving a book using its ID.
- Adding a new book.
- Updating existing book details.
- Deleting a book.
- Testing search and filtering functionality.
- Testing invalid input and missing fields.
- Testing requests for nonexistent book IDs.

## 9. Debugging and Issues Faced

During development, the following issues were encountered and addressed:

1. **EADDRINUSE:** Occurs when the selected port is already in use. Resolved by stopping the process using the port or selecting another available port.

2. **MODULE_NOT_FOUND:** Occurs when a required module or file cannot be located. Resolved by checking import paths and installing the required dependencies.

3. **No Such Table:** Occurs when the database table does not exist or the application connects to the wrong database file. Resolved by verifying the database path and initializing the table.

4. **Missing Await:** Asynchronous database operations require proper use of `async` and `await` to ensure that results are available before sending responses.

5. **Deployment Compatibility:** Encountered a native SQLite dependency compatibility issue during Render deployment. The deployment configuration was adjusted to build the SQLite dependency in the deployment environment.

## 10. Deployment

The application is deployed using Render.

**Live URL:**

https://bdf-lab-3-er43.onrender.com/

The root endpoint displays a welcome message:

```text
Welcome to Books API
```

The deployed API can be accessed using the `/books/` endpoint.

## 11. Learning Outcomes

Through this lab, I learned:

- How to develop RESTful APIs using Node.js and Express.js.
- How to perform CRUD operations using SQLite.
- How to work with HTTP methods and status codes.
- How to implement query parameters and filtering.
- How to validate incoming request data.
- How to handle errors and debug application issues.
- How to test APIs using Postman.
- How to deploy a Node.js application using Render.
- How to manage source code using Git and GitHub.

---

## Conclusion

This lab provided practical experience in developing and deploying a RESTful API using Node.js, Express.js and SQLite. It helped strengthen my understanding of backend development, database operations, API testing, validation, debugging and deployment.
