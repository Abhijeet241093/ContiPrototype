import cv2
import os
from pathlib import Path
import json
import numpy as np
dicPath =os.path.dirname(Path(__file__).resolve())
print(dicPath)
labelsPath = os.path.join(dicPath, "intrusionModel/intrusionDetector.names")
# LABELS = open(labelsPath).read().strip().split("\n")

# Load trained model
weightsPath = os.path.join(dicPath, "intrusionModel/intrusionDetector.weights")
configPath =  os.path.join(dicPath, "intrusionModel/intrusionDetector.cfg")

# Cudnn using
net = cv2.dnn.readNet(weightsPath, configPath)
net.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA)
net.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA_FP16)

model = cv2.dnn_DetectionModel(net)
model.setInputParams(size=(416, 416), scale=1/255, swapRB=True)

def dectect(data):
    arr = np.asarray(bytearray(data.content), dtype=np.uint8)
    frame = cv2.imdecode(arr, -1)

    classes, scores, boxes = model.detect(frame, 0.5, 0.5)
    return  boxes.tolist() # { 'classes': json.dumps(classes), 'scores': json.dumps(scores) , 'boxes': json.dumps(boxes)}