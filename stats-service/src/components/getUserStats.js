import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validateAuthorizationHeader } from "./verifyAuth.js"; 

dotenv.config();

export function getUserStats(request, reply) {
    try {
        const payload = validateAuthorizationHeader(request);
        // Extract username from JWT token
        const username = payload.username;
        const db = request.server.db;
        
        // Get wins count
        const wins = db.prepare(`
            SELECT COUNT(*) as count 
            FROM games 
            WHERE winner_username = ?
        `).get(username);

        // Get losses count
        const losses = db.prepare(`
            SELECT COUNT(*) as count 
            FROM games 
            WHERE looser_username = ?
            `).get(username);
            
        // Get recent games (limit to 5)
        const recentGames = db.prepare(`
            SELECT * FROM games 
            WHERE winner_username = ? OR looser_username = ? 
            ORDER BY game_date DESC LIMIT 5
            `).all(username, username);

        return {
            username,
            wins: wins.count,
            losses: losses.count,
            recentGames
        };
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Failed to get user statistics' });
    }
}

export function getFriendStats(request, reply) {
    try {
        const payload = validateAuthorizationHeader(request);
        const friendname =  payload.username;
        const db = request.server.db;

        // Get wins count
        const wins = db.prepare(`
            SELECT COUNT(*) as count 
            FROM games 
            WHERE winner_username = ?
        `).get(friendname);

        // Get losses count
        const losses = db.prepare(`
            SELECT COUNT(*) as count 
            FROM games 
            WHERE looser_username = ?
        `).get(friendname);

        // Get recent games (limit to 5)
        const recentGames = db.prepare(`
            SELECT * FROM games 
            WHERE winner_username = ? OR looser_username = ? 
            ORDER BY game_date DESC LIMIT 5
            `).all(friendname, friendname);

        return {
            username: friendname,
            wins: wins.count,
            losses: losses.count,
            recentGames
        };
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Failed to get friend statistics' });
    }
}