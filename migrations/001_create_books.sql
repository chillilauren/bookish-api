DROP TABLE IF EXISTS book;

CREATE TABLE book (
    id                  SERIAL PRIMARY KEY,
    title               VARCHAR(128) NOT NULL,
    cover_image_url     VARCHAR(255),
    year_published      INT,
    publisher           VARCHAR(255),
    isbn                varchar(13),
    author              VARCHAR(255) NOT NULL   
);

select * from book;