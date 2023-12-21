const { MongoClient, ObjectId } = require('mongodb');

// Connection URL
const url = "mongodb://martin:martin@localhost:27017";
const client = new MongoClient(url);


async function getCollection(collection) {
    try {
        await client.connect();
        console.log('Connected to mongoDB!');
        const db = client.db('user');
        return db.collection(collection);
    } catch (error) {
        console.error(error);
    }
}

function closeDB() {
    client.close();
    console.log('Connection to mongoDB closed');
}

module.exports.getCommands = async (name) => {
    const collection = await getCollection('commands');

    const toSearch = name ? { name: name } : {};
    const findResult = await collection.find(toSearch).toArray();

    closeDB();

    return findResult;
}

module.exports.getCommand = async (id) => {
    const collection = await getCollection('commands');

    const result = await collection.findOne({ _id: new ObjectId(id) });
    closeDB();

    return result;
}

module.exports.postCommand = async (command) => {
    if (command?.products == null) return;
    const response = await fetch("http://localhost:3000/api/products");
    const products = await response.json();

    let totalPrice = 0;
    const notFound = [];
    const productsPresent = [];
    command.products.forEach(productId => {
        const isFound = products.find(product => product._id == productId);
        if (isFound != null) {
            productsPresent.push(isFound);
            totalPrice += isFound.price;
        } 
        else notFound.push(productId);
    });

    if (notFound.length > 0) return { productsNotfound: notFound };

    const date = new Date();

    command.products = productsPresent;
    command.totalPrice = totalPrice;
    command.created_at = date.toUTCString();
    const collection = await getCollection('commands');
    const inserted = await collection.insertOne(command);
    closeDB();

    return inserted;
}
