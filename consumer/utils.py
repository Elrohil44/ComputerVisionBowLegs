import cv2
import numpy as np
from losses import bce_dice_loss, dice_coeff
from keras.models import load_model
from skimage import transform, morphology, img_as_ubyte, color, io

MODEL_PATH = './models/model.h5'
IMAGES_DIR_PATH = '/var/content/static'
MASK_IMAGES_DIR_PATH = '{}/masks'.format(IMAGES_DIR_PATH)
PREDICTION_IMAGES_DIR_PATH = '{}/predictions'.format(IMAGES_DIR_PATH)

UNet = load_model(MODEL_PATH, custom_objects={'bce_dice_loss': bce_dice_loss, 'dice_coeff': dice_coeff})
input_shape = UNet.get_layer(index=0).input_shape[1:3]


def get_masked_image(img, mask, alpha=1.):
    """Returns image with GT lung field outlined with red,
    predicted lung field filled with blue."""
    rows, cols = img.shape[:2]
    color_mask = np.zeros((rows, cols, 3))

    color_mask[mask > .5] = [0, 0, 1]
    img_color = np.dstack((img, img, img))

    img_hsv = color.rgb2hsv(img_color)
    color_mask_hsv = color.rgb2hsv(color_mask)

    img_hsv[..., 0] = color_mask_hsv[..., 0]
    img_hsv[..., 1] = color_mask_hsv[..., 1] * alpha

    img_masked = color.hsv2rgb(img_hsv)
    return img_masked


def get_predicted_mask(original_grey_scale_image):
    original_height, original_width = original_grey_scale_image.shape[:2]
    image = transform.resize(original_grey_scale_image[:, :], input_shape, mode='constant')
    image = np.expand_dims(image, -1)
    image -= image.mean()
    image /= image.std()

    inp_shape = image.shape
    xx = image[:, :, :][None, ...]
    pred = UNet.predict(xx)[..., 0].reshape(inp_shape[:2])
    pr = pred > 0.5

    pr_bin = img_as_ubyte(pr)
    pr_openned = morphology.opening(pr_bin)

    resized_mask = cv2.resize(pr_openned, (original_width, original_height))

    return resized_mask


def read_source_image(path):
    return io.imread('{}/{}'.format(IMAGES_DIR_PATH, path), True)


def save_mask_image(filename, image):
    path = '{}/{}'.format(MASK_IMAGES_DIR_PATH, filename)
    io.imsave(path, img_as_ubyte(image), quality=100)
    return '/'.join(path.split('/')[-2:])


def save_prediction_image(filename, image):
    path = '{}/{}'.format(PREDICTION_IMAGES_DIR_PATH, filename)
    io.imsave(path, img_as_ubyte(image), quality=100)
    return '/'.join(path.split('/')[-2:])
