const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to Books API");
});
const dbPath = path.join(__dirname, "database", "books.db");

let db;

// Initialize database and server
const initializeDBAndServer = async () => {
  try {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(process.env.PORT || 3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// GET /books - Search, Sort, Filter and Pagination
app.get("/books/", async (req, res) => {
  try {
    const {
      search_q = "",
      order_by = "id",
      order = "ASC",
      limit = "500",
      offset = "0",
      min_price,
      max_price,
    } = req.query;

    // Validate sorting column
    const allowedColumns = ["id", "title", "author", "price"];

    if (!allowedColumns.includes(order_by)) {
      return res.status(400).json({
        message: "Invalid order_by column",
      });
    }

    // Validate sorting order
    const sortOrder = order.toUpperCase();

    if (!["ASC", "DESC"].includes(sortOrder)) {
      return res.status(400).json({
        message: "Order must be ASC or DESC",
      });
    }

    // Validate limit and offset
    const pageLimit = Number(limit);
    const pageOffset = Number(offset);

    if (
      !Number.isInteger(pageLimit) ||
      pageLimit <= 0 ||
      !Number.isInteger(pageOffset) ||
      pageOffset < 0
    ) {
      return res.status(400).json({
        message: "Invalid limit or offset",
      });
    }

    // Build SQL query
    let query = `SELECT * FROM book WHERE title LIKE ?`;
    const params = [`%${search_q}%`];

    // Price filtering
    if (min_price !== undefined) {
      const min = Number(min_price);

      if (!Number.isFinite(min)) {
        return res.status(400).json({
          message: "min_price must be numeric",
        });
      }

      query += " AND price >= ?";
      params.push(min);
    }

    if (max_price !== undefined) {
      const max = Number(max_price);

      if (!Number.isFinite(max)) {
        return res.status(400).json({
          message: "max_price must be numeric",
        });
      }

      query += " AND price <= ?";
      params.push(max);
    }

    if (
      min_price !== undefined &&
      max_price !== undefined &&
      Number(min_price) > Number(max_price)
    ) {
      return res.status(400).json({
        message: "min_price cannot exceed max_price",
      });
    }

    // Sorting and pagination
    query += ` ORDER BY ${order_by} ${sortOrder} LIMIT ? OFFSET ?`;

    params.push(pageLimit, pageOffset);

    const books = await db.all(query, params);

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// GET /books/:bookId - Get a single book
app.get("/books/:bookId/", async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await db.get("SELECT * FROM book WHERE id = ?", [bookId]);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// POST /books - Create a book
app.post("/books/", async (req, res) => {
  try {
    const { title, author, price, pages = 0 } = req.body;

    if (
      !title ||
      !author ||
      typeof price !== "number" ||
      !Number.isFinite(price)
    ) {
      return res.status(400).json({
        message: "Title, author and numeric price are required",
      });
    }

    const result = await db.run(
      `INSERT INTO book (title, author, price, pages)
       VALUES (?, ?, ?, ?)`,
      [title, author, price, pages],
    );

    return res.status(201).json({
      message: "Book added successfully",
      bookId: result.lastID,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// PUT /books/:bookId - Update a book
app.put("/books/:bookId/", async (req, res) => {
  try {
    const { bookId } = req.params;
    const { title, author, price, pages = 0 } = req.body;

    if (
      !title ||
      !author ||
      typeof price !== "number" ||
      !Number.isFinite(price)
    ) {
      return res.status(400).json({
        message: "Title, author and numeric price are required",
      });
    }

    const result = await db.run(
      `UPDATE book
       SET title = ?, author = ?, price = ?, pages = ?
       WHERE id = ?`,
      [title, author, price, pages, bookId],
    );

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    return res.status(200).json({
      message: "Book updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE /books/:bookId - Delete a book
app.delete("/books/:bookId/", async (req, res) => {
  try {
    const { bookId } = req.params;

    const result = await db.run("DELETE FROM book WHERE id = ?", [bookId]);

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    return res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});
