import os
from confluent_kafka import Consumer

KAFKA_BROKER = os.environ.get('KAFKA_BROKER')

assert KAFKA_BROKER, 'Missing Kafka broker URL'

def handle_image(id):
    pass


if __name__ == '__main__':
    print('aaaaa')
    c = Consumer({
        'bootstrap.servers': KAFKA_BROKER,
        'group.id': 'worker_group',
        'auto.offset.reset': 'earliest',
        'error_cb': lambda x: print('ERROR', x)
        # 'enable.auto.commit': False
    })

    c.subscribe(['jobs'])

    while True:
        msg = c.poll(10.0)
        print('Timeout' if msg is None else 'Received message')
        if msg is None:
            continue
        if msg.error():
            print("Consumer error: {}".format(msg.error()))
            continue
        print(msg.value())

print('aaaaaaaaaaa')
