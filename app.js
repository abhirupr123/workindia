import express from 'express';
import bcryptjs from 'bcryptjs';
const db=require('./db.js');

const jwt=require('jsonwebtoken');
const cryp=require('crypto');
require('dotenv').config();

const app=express();

const secret=cryp.randomBytes(32).toString('hex');

app.post('/api/admin/signup', async(req, res)=>{
    const{username, password, email}=req.body;
    const pwd= await bcryptjs.hash(password, 10);

    const userID=await db.create(username, pwd, email);

    res.json({
        status:'Admin account created successfully',
        status_code:'200',
        user_id:userID
    })
});

app.post('/api/admin/login', async(req, res)=>{
    const {username, password}=req.body;
    const user=await db.get(username);
    if(!user)
    {
        return res.status(401).json({
            status:"User not found",
            status_code:"401"
        });
    }

    const pass=await bcryptjs.compare(password, user.password);
    if(!pass)
    {
        return res.status(401).json({
            status: "Incorrect username/password provided. Please retry",
            status_code: 401
        });
    }
    const token=jwt.sign(user, secret, {expiresIn: '1h'});

    res.json({
        status:"Login successfull",
        status_code: 200,
        user_id: user.id,
        access_token: token
    });
});


const verify=(req, res, next)=>{
    const auth=req.headers.authorization;
    if(!auth || !auth.startsWith('Bearer ')){
        return res.status(401).json({
            status: "Unauthorized access. Please login",
            status_code: 401,
        });
    }
    const token = auth.split(' ')[1];
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.status(403).json({
            status: "Invalid or expired token",
            status_code: 403,
          });
        }
        req.user=decoded;
    });
    next();
};

app.post('/api/matches', verify, async (req, res)=>{
    const matchId = await db.insert(req.body.team_1, req.body.team_2, req.body.date, req.body.venue);
    res.json({
        message: "Match created successfully",
        match_id: matchId,
    });
});

app.get('/api/matches', async(req, res)=>{
    const matches=await db.getmatches();
    res.json({
        matches:matches
    });
});

app.get('/api/matches/:match_id', async(req, res)=>{
    const matchid=req.params.match_id;
    const details= await db.details(matchid);
    if (!details) {
        return res.status(404).json({
          message: "Match not found",
          status_code: 404,
        });
      }
      
      res.json(details);
});

const addPlayer = async (req, res) => {
    const team = req.params.team_id;
    const { name, role } = req.body; 
    const connection = await pool.getConnection();
  
    const teams = 'SELECT * FROM teams WHERE id = ?';
    const [teamresults] = await connection.execute(teams, [team]);
      if (teamresults.length === 0) {
        return res.status(404).json({
          message: "Team not found",
          status_code: 404,
        });
      }
  
      const players = 'INSERT INTO squad (team_id, player_name, role) VALUES (?, ?, ?)';
      const [results] = await connection.execute(players, [team, name, role]);
  
      connection.release();
      return res.json({
        message: "Player added to squad successfully",
        player_id: results.insertId,
      });
  };
  app.post('/api/teams/:team_id/squad', addPlayer);

const getStats = async (req, res) => {
    const player = req.params.player_id;
      const connection = await pool.getConnection();
      const sql = 'SELECT * FROM player_stats WHERE player_id = ?';
      const [results] = await connection.execute(sql, [player]);
      connection.release();
  
      if (results.length === 0) {
        return res.status(404).json({
          message: "Player statistics not found",
          status_code: 404,
        });
      }
  
      const stats = results[0];
  
      res.json(stats);
};
  
app.get('/api/players/:player_id/stats', getStats);  

app.listen(3000, ()=>{
    console.log("Server running on port 3000");
});