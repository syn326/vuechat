CREATE TABLE users
(
    user_id INT NOT NULL PRIMARY KEY auto_increment,
    user_name VARCHAR(32) NOT NULL UNIQUE,
    user_password VARCHAR(64) NOT NULL,
    user_sex CHAR(8),
    user_email VARCHAR(32) UNIQUE,
    user_reg_time CHAR(32),
    user_status CHAR(2)
);
