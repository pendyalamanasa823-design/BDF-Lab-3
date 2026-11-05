const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const checkDatabases = async () => {
  const files = [
    "books.db",
    path.join("database", "books.db")
  ];

  for (const file of files) {
    const db = await open({
      filename: path.join(__dirname, file),
      driver: sqlite3.Database
    });

    const tables = await db.all(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );

    console.log("\nDatabase:", file);
    console.log("Tables:", tables);

    await db.close();
  }
};

checkDatabases();
