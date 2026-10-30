import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./GameDetail.css";

function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api.rawg.io/api/games/${id}?key=097aaf59ca6740a29a2df42fb5826668`)
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching game details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="game-detail-container">Loading...</div>;
  if (!game) return <div className="game-detail-container">Game not found.</div>;

  return (
    <div className="game-detail-container">
      <Link to="/" className="game-detail-back">← Back</Link>
      <h2 className="game-detail-title">{game.name}</h2>
      <img src={game.background_image} alt={game.name} className="game-detail-img" />
      <p className="game-detail-info"><strong>Rating:</strong> {game.rating}</p>
      <p className="game-detail-info"><strong>Platforms:</strong> {game.platforms?.map(p => p.platform.name).join(", ")}</p>
      <p className="game-detail-info"><strong>Released:</strong> {game.released}</p>
      <div className="game-detail-description">
        <strong>Description:</strong>
        <span dangerouslySetInnerHTML={{ __html: game.description }} />
      </div>
    </div>
  );
}

export default GameDetail;