DROP TABLE IF EXISTS copy;

CREATE TABLE copy (
    id          SERIAL PRIMARY KEY,
    book_id     INT REFERENCES book(id),
    condition   VARCHAR(16),
    status      VARCHAR(16)
);
