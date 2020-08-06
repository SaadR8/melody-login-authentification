from sklearn.decomposition import PCA
import numpy as np
from sklearn.metrics import mean_absolute_error, median_absolute_error, max_error
from feature_extraction import spec_extraction
from joblib import dump, load
from sklearn.preprocessing import MinMaxScaler

X_train = np.load('train_x.npy')
X_train = np.reshape(X_train, (10, 1487700))

# Not required for this problem scales data between 0 and 1
#scaler = MinMaxScaler()
#X_train = scaler.fit_transform(X_train)

# not be required for the current problem, potentially could lower accuracy, thus removed
#X_train_mean = np.mean(X_train, axis=0)
#X_train = X_train - X_train_mean


#test = spec_extraction('sound-clips2/wings2.wav', 2900)
#test = spec_extraction('test.wav', 2900)
#test = np.reshape(test, (1, 1487700))

n_components = 5
pca = PCA(n_components=n_components, whiten=False).fit(X_train)

dump(pca, 'pca.joblib')

X_train_pca = pca.transform(X_train)
np.save('X_train_pca.npy', X_train_pca)
#test_pca = pca.transform(test)

"""
error = []

for i in range(10):
    error.append(max_error(X_train_pca[i], test_pca[0]))


print(error.index(min(error)))
print(error)
"""
