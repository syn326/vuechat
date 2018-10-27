CREATE TABLE msg (
       msg_id INT PRIMARY KEY NOT NULL auto_increment,
       msg_time CHAR(20),
       user_id INT,
       contact_id INT,
       msg_content VARCHAR(128),
       is_read CHAR(2)
   )
