import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import GameDetail from "./pages/GameDetail";
import Review from "./pages/Review";
import Login from "./pages/Login"; 

function Layout() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("https://api.rawg.io/api/games?key=097aaf59ca6740a29a2df42fb5826668")
      .then((res) => res.json())
      .then((data) => setGames(data.results || []))
      .catch((err) => console.error("Error fetching games:", err));
  }, []);

  return (
    <div style={{ background: "#181a1b", minHeight: "100vh" }}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <>
              <div
                className="container-fluid navbar"
                style={{
                  background: "linear-gradient(90deg, #23272a 60%, #ffb347 100%)",
                  color: "#fff",
                  padding: "1rem 2rem",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                }}
              >
                <div className="row align-items-center">
                  <div className="col-auto">
                    <span className="navbar-brand">
                      <Link
                        to="/"
                        className="text-decoration-none"
                        style={{
                          color: "#ffb347",
                          fontWeight: "bold",
                          fontSize: "2rem",
                          letterSpacing: "2px",
                        }}
                      >
                        RAWG
                      </Link>
                    </span>
                  </div>
                  <div className="col-auto">
                    <button className="btn btn-warning btn-sm btn-custom">
                      🎯 Rate top games
                    </button>
                  </div>
                  <div className="col">
                    <div className="d-flex align-items-center">
                      <i
                        className="fas fa-search"
                        style={{ color: "#ffb347" }}
                      ></i>
                      <input
                        className="search-bar"
                        type="search"
                        placeholder="🔍 Search 892,360 games"
                        aria-label="Search"
                        style={{
                          marginLeft: "0.5rem",
                          padding: "0.5rem 1rem",
                          borderRadius: "8px",
                          border: "none",
                          width: "70%",
                          background: "#23272a",
                          color: "#fff",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-auto">
                    <Link
                      to="/login"
                      className="nav-link d-inline"
                      style={{ color: "#fff" }}
                    >
                      LOG IN
                    </Link>
                    <Link
                      to="/signup"
                      className="nav-link d-inline"
                      style={{ color: "#fff" }}
                    >
                      SIGN UP
                    </Link>
                    <a href="#" className="nav-link d-inline" style={{ color: "#fff" }}>
                      API
                    </a>
                    <a href="#" className="nav-link d-inline" style={{ color: "#fff" }}>
                      ...
                    </a>
                  </div>
                </div>
              </div>

              <div
                className="container-fluid"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  minHeight: "calc(100vh - 70px)", // Adjust for navbar height
                }}
              >
                <div
                  className="sidebar"
                  style={{
                    background: "#23272a",
                    borderRadius: "16px",
                    padding: "2rem 1rem",
                    minHeight: "100%",
                    color: "#fff",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                    width: "260px",
                    marginRight: "2rem",
                    position: "sticky",
                    top: "80px",
                    height: "fit-content",
                    alignSelf: "flex-start",
                  }}
                >
                  <h2 className="fw-bolder fs-1" style={{ color: "#ffb347" }}>
                    <Link
                      to="/"
                      style={{ color: "#ffb347", textDecoration: "none" }}
                    >
                      Home
                    </Link>
                  </h2>
                  <h2
                    className="fw-bolder"
                    style={{ marginTop: "1.5rem" }}
                  >
                    <Link
                      to="/review"
                      style={{ color: "#fff", textDecoration: "none" }}
                    >
                      Reviews
                    </Link>
                  </h2>
                  <div style={{ marginTop: "2rem", fontSize: "1.1rem" }}>
                    <h6 style={{ color: "#ffb347" }}>New Releases</h6>
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      Last 30 days
                    </a>
                    <br />
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      This week
                    </a>
                    <br />
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      Next week
                    </a>
                    <br />
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      Release calendar
                    </a>
                    <h6 style={{ color: "#ffb347", marginTop: "1rem" }}>Top</h6>
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      Best of the year
                    </a>
                    <br />
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      Popular in 2024
                    </a>
                    <br />
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      All time top 250
                    </a>
                    <h6 style={{ color: "#ffb347", marginTop: "1rem" }}>
                      All Games
                    </h6>
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      Browse
                    </a>
                    <h6 style={{ color: "#ffb347", marginTop: "1rem" }}>
                      Platforms
                    </h6>
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      PC
                    </a>
                    <br />
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      PlayStation 4
                    </a>
                    <br />
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      Xbox One
                    </a>
                    <br />
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      Show all
                    </a>
                    <h6 style={{ color: "#ffb347", marginTop: "1rem" }}>
                      Genres
                    </h6>
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      Free Online Games
                    </a>
                    <br />
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      Action
                    </a>
                    <br />
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      Strategy
                    </a>
                    <br />
                    <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
                      Show all
                    </a>
                  </div>
                </div>

                <div
                  className="main-content"
                  style={{
                    flex: 1,
                    padding: "2rem 0",
                    minHeight: "100%",
                  }}
                >
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <>
                          <div
                            className="d-flex justify-content-between align-items-center filters"
                            style={{ marginBottom: "2rem" }}
                          >
                            <h2
                              className="section-title"
                              style={{ color: "#ffb347", fontWeight: "bold" }}
                            >
                              New and trending
                            </h2>
                          </div>
                          <div className="row">
                            {games.map((game) => (
                              <div
                                className="col-md-3 col-sm-6 mb-4"
                                key={game.id}
                              >
                                <div
                                  className="game-card"
                                  style={{
                                    background: "rgba(35,39,42,0.95)",
                                    borderRadius: "14px",
                                    boxShadow:
                                      "0 4px 16px rgba(0,0,0,0.12)",
                                    padding: "1rem",
                                    transition:
                                      "transform 0.2s, box-shadow 0.2s",
                                    cursor: "pointer",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Link to={`/game/${game.id}`}>
                                    <img
                                      src={game.background_image}
                                      alt={game.name}
                                      className="img-fluid rounded"
                                      style={{
                                        width: "100%",
                                        height: "180px",
                                        objectFit: "cover",
                                        borderRadius: "10px",
                                        marginBottom: "1rem",
                                        boxShadow:
                                          "0 2px 8px rgba(255,179,71,0.10)",
                                        transition: "transform 0.2s",
                                      }}
                                    />
                                  </Link>
                                  <div
                                    className="card-body"
                                    style={{ padding: "0" }}
                                  >
                                    <p
                                      className="game-title"
                                      style={{
                                        color: "#fff",
                                        fontWeight: "bold",
                                        fontSize: "1.1rem",
                                        marginBottom: "0.5rem",
                                      }}
                                    >
                                      {game.name}
                                    </p>
                                    <small
                                      style={{
                                        color: "#ffb347",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      ⭐ {game.rating}
                                    </small>
                                    <br />
                                    <small
                                      className="text-muted"
                                      style={{ color: "#bbb" }}
                                    >
                                      {game.parent_platforms
                                        ?.map((p) => p.platform.name)
                                        .join(", ")}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      }
                    />
                    <Route path="/game/:id" element={<GameDetail />} />
                    <Route path="/review" element={<Review />} />
                  </Routes>
                </div>
              </div>
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default Layout;