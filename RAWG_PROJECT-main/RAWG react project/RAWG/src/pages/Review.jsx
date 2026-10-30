import React, { useEffect, useState } from "react";
import "./Review.css"; // Import external CSS

function Review() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.rawg.io/api/games?key=097aaf59ca6740a29a2df42fb5826668")
      .then((res) => res.json())
      .then((data) => {
        setGames(data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching games:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading reviews...</div>;

  return (
    <div className="review-container">
      <h2 className="review-title">🎮 Game Reviews</h2>
      <div className="review-grid">
        {games.map((game) => (
          <div key={game.id} className="review-card">
            <div className="review-header">
              <img
                src={game.background_image}
                alt={game.name}
                className="review-img"
              />
              <div>
                <h4 className="review-name">{game.name}</h4>
                <small className="review-rating">⭐ {game.rating}</small>
                <br />
                <small className="review-platforms">
                  {game.parent_platforms
                    ?.map((p) => p.platform.name)
                    .join(", ")}
                </small>
              </div>
            </div>
            <p className="review-text">
              <strong>Review:</strong>{" "}
              {game.slug.replace(/-/g, " ").slice(0, 60)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Review;