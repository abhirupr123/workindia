CREATE TABLE teams (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE players (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
);

CREATE TABLE matches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  team_1_id INT NOT NULL,
  team_2_id INT NOT NULL,
  date DATE NOT NULL,
  venue VARCHAR(255) NOT NULL,
  FOREIGN KEY (team_1_id) REFERENCES teams(id),
  FOREIGN KEY (team_2_id) REFERENCES teams(id)
);

CREATE TABLE squad (
  id INT PRIMARY KEY AUTO_INCREMENT,
  match_id INT NOT NULL,
  player_id INT NOT NULL,
  team_id INT NOT NULL,
  FOREIGN KEY (match_id) REFERENCES matches(id),
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE player_stats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  player_id INT NOT NULL,
  matches_played INT NOT NULL,
  runs INT,
  average DECIMAL,
  strike_rate DECIMAL,
  FOREIGN KEY (player_id) REFERENCES players(id)
);

CREATE TABLE admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash CHAR(60) NOT NULL,  
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
