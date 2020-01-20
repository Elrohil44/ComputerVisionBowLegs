import os
import requests
import json
import time
from confluent_kafka import Consumer
from utils import read_source_image, get_predicted_mask, get_masked_image, \
    save_mask_image, save_prediction_image

KAFKA_BROKER = os.environ.get('KAFKA_BROKER')
API_URL = os.environ.get('API_URL')
API_TOKEN = os.environ.get('API_TOKEN')
GROUP = 'bow-legs-worker-group'
TOPIC = 'bow-legs-jobs'

HTTP_204 = 204
HTTP_401 = 401

assert KAFKA_BROKER, 'Missing Kafka broker URL'
assert API_URL, 'Missing API URL'
assert API_TOKEN, 'Missing API Token'

headers = {
    'api-auth': API_TOKEN,
    'content-type': 'application/json'
}


def handle_response(response, expected_status_code):
    if response.status_code == expected_status_code:
        return
    if response.status_code == HTTP_401:
        raise Exception('Unauthorized')
    raise Exception('Could not connect to the API')


def handle_image(prediction_request):
    path = prediction_request['sourcePath']
    id = prediction_request['id']
    prediction_url = '{}/prediction/{}'.format(API_URL, id)
    body = {'status': 'IN_PROGRESS', 'inProgressSince': time.time() * 1000}
    r = requests.put(prediction_url, data=json.dumps(body), headers=headers)
    handle_response(r, HTTP_204)
    original_image = read_source_image(path)
    predicted_mask = get_predicted_mask(original_image)
    masked_image = get_masked_image(original_image, predicted_mask)
    mask_image_path = save_mask_image(path.split('/')[-1], predicted_mask)
    prediction_image_path = save_prediction_image(path.split('/')[-1], masked_image)
    body = {
        'status': 'COMPLETED',
        'maskPath': mask_image_path,
        'predictionPath': prediction_image_path,
    }
    r = requests.put(prediction_url, data=json.dumps(body), headers=headers)
    handle_response(r, HTTP_204)


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
        handle_image(json.loads(msg.value().decode('utf-8')))
        c.commit(msg)
