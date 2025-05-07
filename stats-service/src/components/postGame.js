export default function postGame(request, reply){
    const db = request.server.db;
    const query = db.prepare("INSERT INTO games (winner_username, winner_points, looser_username, looser_points, game_date) VALUES (?, ?, ?, ?, ?)");
     // Format the date string for SQLite
    const formattedDate = request.body.game_date.replace('T', ' ').split('.')[0];
    query.run(request.body.winner_username, 10, request.body.looser_username, request.body.looser_points, formattedDate);
    reply.status(200).send({message : "Game stats saved in database"});
    //console.log("Game stats saved in database");
    //console.log(request.body);
    //console.log("Game stats saved in database");  
}
