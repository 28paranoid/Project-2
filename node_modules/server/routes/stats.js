const express = require('express');
const { Session, Goal } = require('../db');
const authGuard = require('../middleware/authGuard');
const router = express.Router();

router.use(authGuard);

function toDateStr(date) {
  return date.toISOString().split('T')[0];
}

function getMonday() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
}

router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const completedSessions = await Session.find({ userId, completed: true });

    const total_minutes = completedSessions.reduce((sum, s) => sum + s.planned_minutes, 0);

    const drinkCounts = {};
    completedSessions.forEach(s => {
      drinkCounts[s.drink_id] = (drinkCounts[s.drink_id] || 0) + 1;
    });
    const fav_drink = Object.keys(drinkCounts).sort((a, b) => drinkCounts[b] - drinkCounts[a])[0] || null;

    const mondayStr = getMonday();
    const monday = new Date(mondayStr + 'T00:00:00.000Z');
    const weeklySessions = completedSessions.filter(s => new Date(s.created_at) >= monday);
    const weekly_sessions = weeklySessions.length;
    const weekly_minutes = weeklySessions.reduce((sum, s) => sum + s.planned_minutes, 0);

    const goal = await Goal.findOne({ userId, week_start: mondayStr });
    const weekly_goal_target = goal ? goal.target_minutes : 150;

    const today = new Date();
    const todayStr = toDateStr(today);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yestStr = toDateStr(yesterday);

    const uniqueDates = [...new Set(
      completedSessions.map(s => toDateStr(new Date(s.created_at)))
    )].sort().reverse();

    let streak = 0;
    if (uniqueDates.length > 0 && (uniqueDates[0] === todayStr || uniqueDates[0] === yestStr)) {
      let expected = new Date(uniqueDates[0] + 'T00:00:00Z');
      for (const dateStr of uniqueDates) {
        const curr = new Date(dateStr + 'T00:00:00Z');
        if (curr.getTime() === expected.getTime()) {
          streak++;
          expected.setDate(expected.getDate() - 1);
        } else {
          break;
        }
      }
    }

    res.json({
      streak,
      total_minutes,
      fav_drink,
      weekly_sessions,
      weekly_minutes,
      weekly_goal_target,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
