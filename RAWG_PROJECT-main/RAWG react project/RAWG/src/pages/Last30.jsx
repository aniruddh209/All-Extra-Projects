// pages/Last30Days.jsx
import React, { useEffect, useState } from "react";

function Last30Days() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const today = new Date();
    const last30 = new Date();
    last30.setDate(today.getDate() - 30);

    const start = last30.toISOString().split("T")[0];
    const end = today.toISOString().split("T")[0];

    fetch(
      `https://api.rawg.io/api/games?key=097aaf59ca6740a29a2df42fb5826668&dates=${start},${end}&ordering=-added`
    )
      .then((res) => res.json())
      .then((data) => setGames(data.results || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2 style={{ color: "#ffb347" }}>Best Games - Last 30 Days</h2>
      <div className="row mt-3">
        {games.map((game) => (
          <div className="col-md-3 col-sm-6 mb-4" key={game.id}>
            <div
              style={{
                background: "#23272a",
                borderRadius: "10px",
                padding: "1rem",
              }}
            >
              <img
                src={game.background_image}
                alt={game.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "0.5rem",
                }}
              />
              <h5 style={{ color: "#fff" }}>{game.name}</h5>
              <p style={{ color: "#ffb347" }}>⭐ {game.rating}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Last30Days;