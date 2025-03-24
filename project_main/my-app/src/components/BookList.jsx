import { useState } from 'react';
import BookCard from './BookCard';
import './BookList.css';

function BookList() {
  const [books] = useState([
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      year: 1925,
      coverImage: "https://example.com/gatsby.jpg"
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      year: 1960,
      coverImage: "https://example.com/mockingbird.jpg"
    }
  ]);

  return (
    <div className="book-list">
      <h2>My Books</h2>
      <div className="books-grid">
        {books.map(book => (
          <BookCard
            key={book.id}
            title={book.title}
            author={book.author}
            year={book.year}
            coverImage={book.coverImage}
          />
        ))}
      </div>
    </div>
  );
}

export default BookList;