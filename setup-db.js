
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const createTable = async () => {
  const db = await open({
    filename: path.join(__dirname, "database", "books.db"),
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS book (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      price INTEGER,
      pages INTEGER
    );
  `);

  const result = await db.get(
    "SELECT COUNT(*) AS count FROM book"
  );

  if (result.count === 0) {
    await db.run(`
      INSERT INTO book (title, author, price, pages)
      VALUES
      ('Java Programming', 'James', 450, 300),
      ('Python Basics', 'Guido', 350, 250),
      ('C Programming', 'Dennis', 250, 200),
      ('Data Structures', 'Mark', 500, 400),
      ('Web Development', 'John', 400, 350)
    `);
  }

  console.log("Book table created successfully!");
  console.log("Sample books inserted successfully!");

  await db.close();
};

createTable();
