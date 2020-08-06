from sklearn.decomposition import PCA
import numpy as np
from sklearn.metrics import mean_squared_error
from feature_extraction import spec_extraction
from joblib import dump, load


def classify(filename):
    pca = load('pca.joblib')

    test = spec_extraction(filename, 2900)

    test = np.reshape(test, (1, 1487700))

    test_pca = pca.transform(test)

    X_train_pca = np.load('X_train_pca.npy')

    error = []

    for i in range(10):
        error.append(mean_squared_error(X_train_pca[i], test_pca[0]))

    return error.index(min(error))
