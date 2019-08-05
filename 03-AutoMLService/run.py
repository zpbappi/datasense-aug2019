import pandas as pd
import pickle as pkl
import azureml.train.automl
import os

sibling_path = lambda x : os.path.join(os.path.dirname(__file__), x)

with open(sibling_path('model.pkl'), 'rb') as f:
  model = pkl.load(f)

df = pd.read_csv(sibling_path('test.csv'))
test = df.drop(['IsChargeback'], axis=1)

# actual values
print(df['IsChargeback'].astype(str).values)

predictions = model.predict(test)
# predicted values
print(predictions)