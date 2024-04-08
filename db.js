import { createPool } from 'mysql2/promise';

const connect=createPool({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
});

async function create(username, pwd, email){
    const connection=connect.getConnection();
    const db='INSERT INTO admin(username, password, email) VALUES (?, ?, ?)';
    const [res]=(await connection).execute(db, [username, pwd, email]);
    (await connection).release();
    return res.insertID;
};

async function get(username){
    const connection=connect.getConnection();
    const db='SELECT * FROM admin WHERE username = ?';
    const [res]=(await connection).execute(db, [username]);
    (await connection).release();
    return res.length > 0 ? res[0]:null;
};

async function insert(team1, team2, date, venue) {
      const connection = await pool.getConnection();
      const sql = 'INSERT INTO matches (team_1, team_2, date, venue) VALUES (?, ?, ?, ?)';
      const [results] = await connection.execute(sql, [team1, team2, date, venue]);
      connection.release();
      return results.insertId;
  };

async function getmatches(){
    const connection = await pool.getConnection();
    const today = new Date().toISOString().slice(0, 10);
    const db = 'SELECT * FROM matches WHERE date >= ?';
    const [results] = await connection.execute(db, [today]);
    connection.release();
    return results;
}

async function details(matchId){
    const connection = await pool.getConnection();

    const matches = 'SELECT * FROM matches WHERE id = ?';
    const [results] = await connection.execute(matches, [matchId]);

    if (results.length === 0)
      return null;

    const match = results[0]; 
    const squad = `
      SELECT s.team_id, p.name, p.jersey_number
      FROM squad s
      INNER JOIN players p ON s.player_id = p.id
      WHERE s.match_id = ?`;
    const [squadResults] = await connection.execute(squad, [matchId]);

    const team1Players = squadResults.filter(player => player.team_id === 1);
    const team2Players = squadResults.filter(player => player.team_id === 2);

    match.team1 = team1Players;
    match.team2 = team2Players;

    connection.release();
    return match;
};

export default{
    create, 
    get, 
    insert,
    getmatches,
    details   
};