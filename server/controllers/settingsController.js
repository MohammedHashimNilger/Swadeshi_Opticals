import Settings from "../models/Settings.js";

// GET /api/settings — public (frontend needs delivery charge, store address, etc.)
export async function getSettings(req, res, next) {
  try {
    const settings = await Settings.getSingleton();
    res.json(settings);
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/settings — admin only
export async function updateSettings(req, res, next) {
  try {
    const settings = await Settings.getSingleton();
    Object.assign(settings, req.body);
    await settings.save();
    res.json(settings);
  } catch (err) {
    next(err);
  }
}
