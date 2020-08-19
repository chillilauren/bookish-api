DROP TABLE IF EXISTS member;

CREATE TABLE member (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(128) NOT NULL,
    email               VARCHAR(255) NOT NULL UNIQUE,
    deleted             BOOLEAN NOT NULL DEFAULT false
);

select * from member;