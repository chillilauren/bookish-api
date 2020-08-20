DROP TABLE IF EXISTS checkout;

CREATE TABLE checkout (
    id          SERIAL PRIMARY KEY,
    member_id   INT REFERENCES member(id) NOT NULL,
    copy_id     INT REFERENCES copy(id) NOT NULL,
    out_date    DATE NOT NULL,
    in_date     DATE
);

select * from checkout;