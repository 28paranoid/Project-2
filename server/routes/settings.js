const express = require('express');
const { UserSettings } = require('../db');
const authGuard = require('../middleware/authGuard');
const router = express.Router();

router.use(authGuard);

router.get('/', async (req, res, next) => {
  try {
    const settings = await UserSettings.findOne({ userId: req.user.id });
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  const { theme, sound_enabled, default_drink, notif_enabled } = req.body;
  const updates = {};
  if (theme !== undefined) updates.theme = theme;
  if (sound_enabled !== undefined) updates.sound_enabled = sound_enabled;
  if (default_drink !== undefined) updates.default_drink = default_drink;
  if (notif_enabled !== undefined) updates.notif_enabled = notif_enabled;

  try {
    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.user.id },
      updates,
      { new: true }
    );
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
