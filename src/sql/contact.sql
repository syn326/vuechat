CREATE table contacts(
    contact_id INT NOT NULL PRIMARY KEY auto_increment,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    start_time CHAR(20),
    status CHAR(2) NOT NULL
 );


