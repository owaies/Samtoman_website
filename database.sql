CREATE DATABASE saif_almamari_db;

USE saif_almamari_db;

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE content (
  id INT PRIMARY KEY,
  home TEXT,
  about TEXT,
  services TEXT,
  products TEXT,
  clients TEXT,
  contact TEXT,
  styles JSON
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admins (username, password) VALUES ('admin', 'admin123');
INSERT INTO content (id) VALUES (1);