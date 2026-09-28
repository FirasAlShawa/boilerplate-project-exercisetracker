import Exercise from "../data/exercise.data.js";
import User from "../data/user.data.js";

export default class UserController {
  static async createNewUser(req, res) {
    console.log(req.body);

    const { username } = req.body || {};

    // || username.length <= 0
    if (!username) {
      res.status(400).json({ error: "Username is required!" });
      return;
    }

    const user = await User.create({ username });

    res.json({
      username: username,
      id: user._id,
    });
  }

  static async getUserDetails(req, res) {
    const { id } = req.params;
    console.log(id);

    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).json({ error: "User not found!" });
      return;
    }

    res.json(user);
  }

  static async addNewExercisToUser(req, res) {
    const { description, duration, date } = req.body;
    const id = req.params.id;

    const user = await UserController.findUser(id);

    const exercise = await Exercise.create({
      userId: id,
      description,
      duration,
      date: UserController.formatToCustomString(date),
    });

    res.json({ username: user.username, ...exercise.toObject() });
  }

  static async userLogs(req, res) {
    const id = req.params.id;

    const user = await UserController.findUser(id);
    const [documents, totalCount] = await Exercise.findAndCount(
      {
        userId: id,
      },
      null,
      { sort: { _id: -1 }, limit: 10, skip: 0 },
    );

    const logs = documents.map((single) =>{
      return {description:single.description, duration:single.duration, date:single.date};
    });

    res.json({
      username: user.username,
      count: totalCount,
      _id: user._id,
      log: [logs],
    });
  }

  static async findUser(id) {
    return await User.findOne({ _id: id });
  }

  static formatToCustomString(dateStr) {
    const [year, month, day] = dateStr.split("-");
    // Month is 0-indexed in JS Date (0 = January, 11 = December)
    const date = new Date(year, month - 1, day);

    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const monthStr = date.toLocaleDateString("en-US", { month: "short" });
    const paddedDay = String(day).padStart(2, "0");

    return `${weekday} ${monthStr} ${paddedDay} ${year}`;
  }
}
