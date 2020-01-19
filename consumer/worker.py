import os
import time
import random
from confluent_kafka import Consumer

KAFKA_BROKER = os.environ.get('KAFKA_BROKER')
GROUP = 'bow-legs-worker-group'
TOPIC = 'bow-legs-jobs'

assert KAFKA_BROKER, 'Missing Kafka broker URL'

def handle_image(id):
    pass


if __name__ == '__main__':
    c = Consumer({
        'bootstrap.servers': KAFKA_BROKER,
        'group.id': GROUP,
        'auto.offset.reset': 'earliest',
        'enable.auto.commit': False
    })

    c.subscribe([TOPIC])

    while True:
        msg = c.poll(1.)
        if msg is None:
            continue
        if msg.error():
            print("Consumer error: {}".format(msg.error()))
            continue
        print(msg.value())
        time.sleep(random.random() * 1.)
        c.commit(msg)
