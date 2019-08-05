from keras.datasets import mnist
from autokeras.image.image_supervised import ImageClassifier

# gather data
(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train = x_train.reshape(x_train.shape + (1,))
x_test = x_test.reshape(x_test.shape + (1,))

# train the model
model = ImageClassifier(verbose=True)
model.fit(x_train, y_train, time_limit=15 * 60)
model.final_fit(x_train, y_train, x_test, y_test, retrain=False)

y = model.evaluate(x_test, y_test)
print(y)