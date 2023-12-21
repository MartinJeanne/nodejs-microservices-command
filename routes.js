const express = require('express');
const bodyParser = require('body-parser');
const mongoClient = require('./mongoClient.js');

const router = express.Router();
module.exports = router;

router.use(bodyParser.json({ extended: true }));

//Get all Method (with search option)
router.get('/commands', async (req, res) => {
    res.send(await mongoClient.getCommands(req.query.name));
});

//Get by ID Method
router.get('/commands/:id', async (req, res) => {
    res.send(await mongoClient.getCommand(req.params.id));
});

//Post Method
router.post('/commands', async (req, res) => {
    res.send(await mongoClient.postCommand(req.body));
});
