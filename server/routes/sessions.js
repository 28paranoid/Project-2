const express = require('express');
const { Session } = require('../db');
const authGuard = require('../middleware/authGuard');
const router = express.Router();

router.use(authGuard);

router.post('/', async (req, res, next) => {
  const { drink_id, planned_minutes, actual_seconds, completed } = req.body;
  try {
    const session = await Session.create({
      userId: req.user.id,
      drink_id,
      planned_minutes,
      actual_seconds,
      completed,
    });
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const sessions = await Session.find({ userId: req.user.id }).sort({ created_at: -1 });
    res.json(sessions);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, userId: req.user.id });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
