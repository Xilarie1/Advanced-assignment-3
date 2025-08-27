// Elements
const bookForm = document.querySelector("#book-form");
const bookListContainer = document.querySelector("#book-list");
const filterFavoritesInput = document.querySelector("#filter-favorites");
const sortByInput = document.querySelector("#sort-by");
const bookStatsEl = document.querySelector("#stats");

// State
let books = JSON.parse(localStorage.getItem("books")) || [];
let bookFilters = { showFavorites: false };

// Save books to localStorage
const saveBooksToStorage = () => {
  localStorage.setItem("books", JSON.stringify(books));
};

// Delete book button
const deleteBookButton = (id) => {
  books = books.filter((b) => b.id !== id);
  saveBooksToStorage();
  renderBooksPage();
};

// Toggle favorite button
const toggleFavoriteButton = (id) => {
  books = books.map((b) => (b.id === id ? { ...b, favorite: !b.favorite } : b));
  saveBooksToStorage();
  renderBooksPage();
};

// Filter and sort books
const filterAndSortBooks = () => {
  let result = books;
  if (bookFilters.showFavorites) {
    result = result.filter((b) => b.favorite);
  }
  if (sortByInput.value === "title") {
    result = result.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortByInput.value === "pages") {
    result = result.sort((a, b) => a.pages - b.pages);
  }
  return result;
};

// Render book stats
const renderBookStats = () => {
  const totalPages = books.reduce((sum, { pages }) => sum + pages, 0);
  const totalBooks = books.length;
  bookStatsEl.textContent = `${totalBooks} books, ${totalPages} pages total`;
};

// Build books list (DOM)
const buildBooksList = (booksArray) => {
  bookListContainer.replaceChildren();

  booksArray.forEach(({ id, title, author, genre, pages, favorite }) => {
    const div = document.createElement("div");
    div.className = "book" + (favorite ? " favorite" : "");

    div.innerHTML = `
      <strong>${title}</strong> by ${author} (${genre}, ${pages} pages)
      <button data-id="${id}" class="fav">${favorite ? "★" : "☆"}</button>
      <button data-id="${id}" class="del">Delete</button>
    `;

    // Wire up buttons
    div
      .querySelector(".del")
      .addEventListener("click", () => deleteBookButton(id));
    div
      .querySelector(".fav")
      .addEventListener("click", () => toggleFavoriteButton(id));

    bookListContainer.appendChild(div);
  });
};

// Render books page
const renderBooksPage = () => {
  buildBooksList(filterAndSortBooks());
  renderBookStats();
};

// Add new book
bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(bookForm);

  const newBook = {
    id: Date.now().toString(),
    title: formData.get("title"),
    author: formData.get("author"),
    genre: formData.get("genre"),
    pages: Number(formData.get("pages")),
    favorite: false,
  };

  books.push(newBook);
  saveBooksToStorage();
  bookForm.reset();
  renderBooksPage();
});

// Filters and sorting events
filterFavoritesInput.addEventListener("change", (e) => {
  bookFilters.showFavorites = e.target.checked;
  renderBooksPage();
});
sortByInput.addEventListener("change", renderBooksPage);

// Initial render
renderBooksPage();
