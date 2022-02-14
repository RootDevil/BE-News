const { selectTopics } = require('../models/topics.model');

exports.getTopics = async (req, res) => {
    const topics = await selectTopics();
    res.status(200).send({ topics });
}