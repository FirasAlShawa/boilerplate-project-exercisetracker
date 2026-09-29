import mongoose from "mongoose";
import Exercise from "../data/exercise.data.js";
import User from "../data/user.data.js";

export default class UserController {
  static async createNewUser(req, res) {
    const { username } = req.body || {};

    if (!username) {
      res.status(400).json({ error: "Username is required!" });
      return;
    }

    const user = await User.create({ username });

    res.json({ username: user.username, _id: user._id });
  }

  static async getAllUsers(req, res) {
    const users = await User.find({}).select("_id username");
    res.json(users);
  }

  static async getUserDetails(req, res) {
    const user = await UserController.findUser(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found!" });
      return;
    }

    res.json(user);
  }

  static async addNewExercisToUser(req, res) {
    const { description, duration, date } = req.body || {};
    const id = req.params.id;

    const user = await UserController.findUser(id);
    if (!user) {
      res.status(404).json({ error: "User not found!" });
      return;
    }

    if (!description || !duration || isNaN(Number(duration))) {
      res.status(400).json({ error: "description and numeric duration are required!" });
      return;
    }

    const exerciseDate = date ? UserController.parseDate(date) : new Date();
    if (!exerciseDate) {
      res.status(400).json({ error: "Invalid date!" });
      return;
    }

    const exercise = await Exercise.create({
      userId: user._id,
      description,
      duration: Number(duration),
      date: exerciseDate,
    });

    res.json({
      _id: user._id,
      username: user.username,
      date: exercise.date.toDateString(),
      duration: exercise.duration,
      description: exercise.description,
    });
  }

  static async userLogs(req, res) {
    const id = req.params.id;
    const { from, to, limit } = req.query;

    const user = await UserController.findUser(id);
    if (!user) {
      res.status(404).json({ error: "User not found!" });
      return;
    }

    const filter = { userId: user._id };
    const fromDate = from && UserController.parseDate(from);
    const toDate = to && UserController.parseDate(to);
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = fromDate;
      if (toDate) filter.date.$lte = toDate;
    }

    let query = Exercise.find(filter).sort({ date: 1 });
    const limitNum = parseInt(limit);
    if (limitNum > 0) query = query.limit(limitNum);

    const documents = await query;

    const log = documents.map((single) => ({
      description: single.description,
      duration: single.duration,
      date: single.date.toDateString(),
    }));

    res.json({
      _id: user._id,
      username: user.username,
      count: log.length,
      log,
    });
  }

  static async findUser(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    return await User.findById(id);
  }

  // Parses "yyyy-mm-dd" as a local date so toDateString() doesn't shift a day
  static parseDate(dateStr) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
    const date = match
      ? new Date(match[1], match[2] - 1, match[3])
      : new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }
}
