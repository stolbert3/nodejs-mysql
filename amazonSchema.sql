DROP DATABASE IF EXISTS amazonHW_db;
CREATE DATABASE amazonHW_db;
USE amazonHW_db;

CREATE TABLE forSale (
	id INT NOT NULL AUTO_INCREMENT,
	item_name VARCHAR(100) NOT NULL,
	department VARCHAR(45) NOT NULL,
	price INT default 0,
	inventory INT default 0,
	PRIMARY KEY (id)
);

INSERT INTO forSale (item_name, department, price, inventory)
VALUES ("tshirt", "clothing", 10, 5),
    ("tennis shoes", "clothing", 25, 5),
    ("socks", "clothing", 5, 5),
    ("music1", "music", 10, 5),
    ("music2", "music", 10, 5),
    ("music3", "music", 10, 5),
    ("food1", "food", 8, 5),
    ("food2", "food", 10, 5),
    ("food3", "food", 5, 5);