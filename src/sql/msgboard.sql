CREATE TABLE msgboard(
    msg_id INT PRIMARY KEY auto_increment,
    post_time CHAR(20),
    user_id int NOT NULL,
    text VARCHAR(128) NOT NULL
)