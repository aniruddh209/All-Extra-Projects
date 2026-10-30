import express from "express";
// const express=require('express')
import dotenv from "dotenv";
dotenv.config();

const app = express();
console.log(process.env.PORT);

app.get("/api/auth/signup", (req, res) => {
  res.send("signup");
});
app.get("/api/auth/login", (req, res) => {
  res.send("login");
});
app.get("/api/auth/logout", (req, res) => {
  res.send("logout");
});

app.listen(3000, () => {
  console.log("runnig");
});
