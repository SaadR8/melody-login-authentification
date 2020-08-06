import librosa
# from madmom.audio.signal import *
import numpy as np
import matplotlib.pyplot as plt
import librosa.display


def spec_extraction(file_name, win_size):

    # y = Signal(file_name, smaple_rate=8000, dtype=np.float32, num_channels=1)
    y, sr = librosa.load(file_name, sr=8000)
    S = librosa.core.stft(y, n_fft=1024, hop_length=80*1, win_length=1024)

    x_spec = np.abs(S)
    x_spec = librosa.core.power_to_db(x_spec, ref=np.max)
    x_spec = x_spec.astype(np.float32)
    num_frames = x_spec.shape[1]

    padNum = num_frames % win_size
    if padNum != 0:
        len_pad = win_size - padNum
        padding_feature = np.zeros(shape=(513, len_pad))
        x_spec = np.concatenate((x_spec, padding_feature), axis=1)
        num_frames = num_frames + len_pad

    return x_spec


"""
train_x = np.empty([10, 513, 2900])

for i in range(0, 10):
    D = spec_extraction('sound-clips2/sound{0}.wav'.format(i), 2900)
    train_x[i] = D


np.save('train_x.npy', train_x)
print('complete')
"""

"""
librosa.display.specshow(D, y_axis='log', x_axis='time')
plt.title('Power spectrogram')
plt.colorbar(format='%+2.0f dB')
plt.tight_layout()
plt.show()
"""
