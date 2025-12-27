const express = require("express");
const db = require("../config/db");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Create Task
router.post("/", protect, (req, res) => {
  const { title } = req.body;

  db.query(
    "INSERT INTO tasks (title,user_id) VALUES (?,?)",
    [title, req.user.id],
    () => res.json({ msg: "Task added" })
  );
});

// Get Tasks
router.get("/", protect, (req, res) => {
  const q =
    req.user.role === "admin"
      ? "SELECT * FROM tasks"
      : "SELECT * FROM tasks WHERE user_id=?";

  db.query(q, [req.user.id], (err, result) => {
    res.json(result);
  });
});

// Delete Task
router.delete("/:id", protect, (req, res) => {
  db.query("DELETE FROM tasks WHERE id=?", [req.params.id], () =>
    res.json({ msg: "Task deleted" })
  );
});

module.exports = router;
