
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const storyBooks = [
  ["Harry Potter and the Philosopher's Stone", "J.K. Rowling"],
  ["Harry Potter and the Chamber of Secrets", "J.K. Rowling"],
  ["Harry Potter and the Prisoner of Azkaban", "J.K. Rowling"],
  ["Harry Potter and the Goblet of Fire", "J.K. Rowling"],
  ["Harry Potter and the Order of the Phoenix", "J.K. Rowling"],
  ["Harry Potter and the Half-Blood Prince", "J.K. Rowling"],
  ["Harry Potter and the Deathly Hallows", "J.K. Rowling"],
  ["The Hobbit", "J.R.R. Tolkien"],
  ["The Fellowship of the Ring", "J.R.R. Tolkien"],
  ["The Two Towers", "J.R.R. Tolkien"],
  ["The Return of the King", "J.R.R. Tolkien"],
  ["The Lion, the Witch and the Wardrobe", "C.S. Lewis"],
  ["Prince Caspian", "C.S. Lewis"],
  ["The Voyage of the Dawn Treader", "C.S. Lewis"],
  ["The Silver Chair", "C.S. Lewis"],
  ["The Horse and His Boy", "C.S. Lewis"],
  ["The Magician's Nephew", "C.S. Lewis"],
  ["The Last Battle", "C.S. Lewis"],
  ["Alice's Adventures in Wonderland", "Lewis Carroll"],
  ["Through the Looking-Glass", "Lewis Carroll"],
  ["The Jungle Book", "Rudyard Kipling"],
  ["The Second Jungle Book", "Rudyard Kipling"],
  ["The Adventures of Tom Sawyer", "Mark Twain"],
  ["Adventures of Huckleberry Finn", "Mark Twain"],
  ["The Prince and the Pauper", "Mark Twain"],
  ["The Secret Garden", "Frances Hodgson Burnett"],
  ["A Little Princess", "Frances Hodgson Burnett"],
  ["Little Lord Fauntleroy", "Frances Hodgson Burnett"],
  ["The Little Prince", "Antoine de Saint-Exupery"],
  ["The Alchemist", "Paulo Coelho"],
  ["Treasure Island", "Robert Louis Stevenson"],
  ["Kidnapped", "Robert Louis Stevenson"],
  ["Strange Case of Dr Jekyll and Mr Hyde", "Robert Louis Stevenson"],
  ["Anne of Green Gables", "L.M. Montgomery"],
  ["Anne of Avonlea", "L.M. Montgomery"],
  ["Anne of the Island", "L.M. Montgomery"],
  ["Little Women", "Louisa May Alcott"],
  ["Good Wives", "Louisa May Alcott"],
  ["Jo's Boys", "Louisa May Alcott"],
  ["Black Beauty", "Anna Sewell"],
  ["The Wonderful Wizard of Oz", "L. Frank Baum"],
  ["The Marvelous Land of Oz", "L. Frank Baum"],
  ["Matilda", "Roald Dahl"],
  ["Charlie and the Chocolate Factory", "Roald Dahl"],
  ["James and the Giant Peach", "Roald Dahl"],
  ["The BFG", "Roald Dahl"],
  ["Fantastic Mr Fox", "Roald Dahl"],
  ["The Witches", "Roald Dahl"],
  ["The Twits", "Roald Dahl"],
  ["The Giraffe and the Pelly and Me", "Roald Dahl"],
  ["The Wind in the Willows", "Kenneth Grahame"],
  ["Peter Pan", "J.M. Barrie"],
  ["Pinocchio", "Carlo Collodi"],
  ["Heidi", "Johanna Spyri"],
  ["The Railway Children", "E. Nesbit"],
  ["Five Children and It", "E. Nesbit"],
  ["The Secret of the Old Clock", "Carolyn Keene"],
  ["The Hidden Staircase", "Carolyn Keene"],
  ["The Mystery of the 99 Steps", "Carolyn Keene"],
  ["The Hound of the Baskervilles", "Arthur Conan Doyle"],
  ["A Study in Scarlet", "Arthur Conan Doyle"],
  ["The Sign of Four", "Arthur Conan Doyle"],
  ["The Adventures of Sherlock Holmes", "Arthur Conan Doyle"],
  ["The Murder of Roger Ackroyd", "Agatha Christie"],
  ["Murder on the Orient Express", "Agatha Christie"],
  ["And Then There Were None", "Agatha Christie"],
  ["Death on the Nile", "Agatha Christie"],
  ["The Mysterious Affair at Styles", "Agatha Christie"],
  ["The Secret Adversary", "Agatha Christie"],
  ["The Fault in Our Stars", "John Green"],
  ["Looking for Alaska", "John Green"],
  ["Paper Towns", "John Green"],
  ["The Book Thief", "Markus Zusak"],
  ["The Kite Runner", "Khaled Hosseini"],
  ["A Thousand Splendid Suns", "Khaled Hosseini"],
  ["The Midnight Library", "Matt Haig"],
  ["The Seven Husbands of Evelyn Hugo", "Taylor Jenkins Reid"],
  ["Daisy Jones and the Six", "Taylor Jenkins Reid"],
  ["The Silent Patient", "Alex Michaelides"],
  ["The Girl on the Train", "Paula Hawkins"],
  ["Gone Girl", "Gillian Flynn"],
  ["The Da Vinci Code", "Dan Brown"],
  ["Angels and Demons", "Dan Brown"],
  ["The Lost Symbol", "Dan Brown"],
  ["The Hunger Games", "Suzanne Collins"],
  ["Catching Fire", "Suzanne Collins"],
  ["Mockingjay", "Suzanne Collins"],
  ["Divergent", "Veronica Roth"],
  ["Insurgent", "Veronica Roth"],
  ["Allegiant", "Veronica Roth"],
  ["Twilight", "Stephenie Meyer"],
  ["New Moon", "Stephenie Meyer"],
  ["Eclipse", "Stephenie Meyer"],
  ["Breaking Dawn", "Stephenie Meyer"],
  ["The Fault in Our Stars", "John Green"],
  ["Wonder", "R.J. Palacio"],
  ["The Giver", "Lois Lowry"],
  ["Bridge to Terabithia", "Katherine Paterson"],
  ["The Outsiders", "S.E. Hinton"],
  ["The Call of the Wild", "Jack London"],
  ["White Fang", "Jack London"]
];

const addStoryBooks = async () => {
  const db = await open({
    filename: path.join(__dirname, "database", "books.db"),
    driver: sqlite3.Database
  });

  try {
    await db.exec("BEGIN TRANSACTION");

    // Remove existing books
    await db.run("DELETE FROM book");

    // Reset ID counter
    await db.run(
      "DELETE FROM sqlite_sequence WHERE name = 'book'"
    );

    const query = `
      INSERT INTO book (title, author, price, pages)
      VALUES (?, ?, ?, ?)
    `;

    for (let i = 0; i < storyBooks.length; i++) {
      const [title, author] = storyBooks[i];

      const price = 200 + (i % 16) * 25;
      const pages = 150 + (i % 15) * 20;

      await db.run(query, [title, author, price, pages]);
    }

    await db.exec("COMMIT");

    const result = await db.get(
      "SELECT COUNT(*) AS total FROM book"
    );

    console.log("Storybooks added successfully!");
    console.log("Total books:", result.total);
  } catch (error) {
    await db.exec("ROLLBACK");
    console.log("Error:", error.message);
  } finally {
    await db.close();
  }
};

addStoryBooks();
