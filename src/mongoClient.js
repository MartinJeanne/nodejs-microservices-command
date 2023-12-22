const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL || 'mongodb://martin:martin@127.0.0.1:27017';
const PRODUCT_URL = process.env.PRODUCT_URL || 'http://localhost:3000/api';

mongoose.connect(MONGO_URL, {
    user: "martin",
    pass: "martin",
    dbName: "user"
});

const commandSchema = new mongoose.Schema({
    products: [String],
    email: String,
    totalPrice: Number,
    created_at: { type: Date, default: Date.now() }
});

const Command = mongoose.model('Command', commandSchema);


module.exports.getCommands = async (name) => {
    return await Command.find();
}

module.exports.getCommand = async (id) => {
    return await Command.findById(id);
}

module.exports.postCommand = async (command) => {
    const response = await fetch(PRODUCT_URL + '/products');
    const products = await response.json();

    let totalPrice = 0;
    const notFound = [];
    command.products.forEach(productId => {
        const isFound = products.find(product => product._id == productId);
        if (isFound != null) totalPrice += isFound.price;
        else notFound.push(productId);
    });

    if (notFound.length > 0) return { productsNotfound: notFound };

    command.totalPrice = totalPrice;
    const newCommand = new Command(command);
    return newCommand.save();
}
