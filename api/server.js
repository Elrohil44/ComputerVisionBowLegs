const assert = require('assert');
const express = require('express');
const { Producer } = require('node-rdkafka');

const { KAFKA_BROKER } = process.env;
const TOPIC = 'jobs';

assert(KAFKA_BROKER, 'Missing Kafka broker URL');

const producer = new Producer({
    'metadata.broker.list': KAFKA_BROKER,
});

producer.on('event.log', console.log);
producer.on('event.error', console.error);
producer.on('delivery-report', console.log);
producer.on('ready', (...args) => {
    console.log('Kafka connected');
    console.log(args);
    setInterval(() => producer.poll(), 1000);
});
producer.on('disconnected', console.log);
producer.connect();


const app = express();
const port = 5000;

app.use((req, res, next) => {
    console.log(req.originalUrl);
    next();
});

app.get('/', (req, res) => {
    const result = producer.produce(TOPIC, -1, Buffer.from('dddddddd' + Math.ceil(Math.random() * 1000000).toFixed(0)));
    res.send(result ? 'OK' : 'WORST');
});

app.listen(port, () => console.log(`API started on port ${port}!`));
