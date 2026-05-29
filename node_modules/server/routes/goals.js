const express = require('express');
const { Goal, Session } = require('../db');
const authGuard = require('../middleware/authGuard');
const router = express.Router();

router.use(authGuard);

function getMonday() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
}

router.get('/', async (req, res, next) => {
  try {
    const monday = getMonday();
    let goal = await Goal.findOne({ userId: req.user.id, week_start: monday });

    if (!goal) {
      goal = await Goal.create({ userId: req.user.id, week_start: monday });
    }

    const mondayDate = new Date(monday + 'T00:00:00.000Z');
    const weeklySessions = await Session.find({
      userId: req.user.id,
      completed: true,
      created_at: { $gte: mondayDate },
    });

    const actual_sessions = weeklySessions.length;
    const actual_minutes = weeklySessions.reduce((sum, s) => sum + s.planned_minutes, 0);

    res.json({
      ...goal.toObject(),
      progress: { sessions: actual_sessions, minutes: actual_minutes },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const { target_minutes, sessions_target } = req.body;
  const monday = getMonday();
  try {
    const goal = await Goal.findOneAndUpdate(
      { userId: req.user.id, week_start: monday },
      { target_minutes, sessions_target },
      { upsert: true, new: true }
    );
    res.json(goal);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  const { target_minutes, sessions_target } = req.body;
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { target_minutes, sessions_target },
      { new: true }
    );
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json(goal);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
