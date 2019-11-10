import cv2
import numpy as np
import tensorflow as tf
import keras
from flask import send_file
import io as IO
import os
from model.losses import bce_dice_loss, dice_coeff
from keras.models import load_model
from skimage import transform, morphology, img_as_ubyte, color


MODEL_PATH = os.environ['MODEL_PATH'] if \
    os.environ.get('MODEL_PATH') else \
    'models/model.h5'


session = tf.compat.v1.Session(graph=tf.Graph())
with session.graph.as_default():
    keras.backend.set_session(session)
    UNet = load_model(MODEL_PATH, custom_objects={'bce_dice_loss': bce_dice_loss, 'dice_coeff': dice_coeff})
input_shape = UNet.get_layer(index=0).input_shape[1:3]


class InvalidImageException(Exception):
    pass


def masked(img, mask, alpha=1.):
    """Returns image with GT lung field outlined with red,
    predicted lung field filled with blue."""
    rows, cols = img.shape[:2]
    color_mask = np.zeros((rows, cols, 3))

    color_mask[mask == 1] = [0, 0, 1]
    img_color = np.dstack((img, img, img))

    img_hsv = color.rgb2hsv(img_color)
    color_mask_hsv = color.rgb2hsv(color_mask)

    img_hsv[..., 0] = color_mask_hsv[..., 0]
    img_hsv[..., 1] = color_mask_hsv[..., 1] * alpha

    img_masked = color.hsv2rgb(img_hsv)
    return img_masked


def hello():
    return '<h1>Hello from Computer Vision - Bow Legs API</h1>'


def predict(body):
    try:
        x = np.frombuffer(body, dtype='uint8')
        original_image = cv2.imdecode(x, cv2.IMREAD_UNCHANGED)
        if original_image is None:
            raise InvalidImageException()

        original_height, original_width = original_image.shape[:2]
        grey_scale = cv2.cvtColor(original_image, cv2.COLOR_BGR2GRAY)
        image = transform.resize(grey_scale[:, :], input_shape, mode='constant')
        image = np.expand_dims(image, -1)
        image -= image.mean()
        image /= image.std()

        inp_shape = image.shape
        xx = image[:, :, :][None, ...]
        with session.graph.as_default():
            keras.backend.set_session(session)
            pred = UNet.predict(xx)[..., 0].reshape(inp_shape[:2])
            pr = pred > 0.5

            pr_bin = img_as_ubyte(pr)
            pr_openned = morphology.opening(pr_bin)

            resized_mask = cv2.resize(pr_openned, (original_width, original_height))
            masked_image = masked(grey_scale, resized_mask > 0.5, 0.5)
            rgb_image = cv2.cvtColor(img_as_ubyte(masked_image), cv2.COLOR_BGR2RGB)

            output = cv2.imencode('.jpeg', rgb_image)[1].tobytes()
            return send_file(
                IO.BytesIO(output),
                mimetype='image/jpeg'
            )
    except InvalidImageException:
        return {
            'code': 400,
            'message': 'Invalid image'
        }, 400
    except Exception as e:
        print(str(e))
    return {
        'code': 500,
        'message': 'Unexpected error'
    }, 500 