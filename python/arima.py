import pandas as pd
from statsmodels.tsa.arima_model import ARIMA

# 1,1,2 ARIMA Model
df = pd.read_csv('data.csv')


# for p in range(6):
#     for q in range(3):
#         model = ARIMA(df.value, order=(p,1,q))
#         model_fit = model.fit(disp=0)
#         if (not (p == 2 and q == 4)):
#             print(p, q, ':', model_fit.bic)

# ARIMA(2, 1, 0) is the best
model = ARIMA(df.value, order=(2, 1, 0))
model_fit = model.fit(disp = 0)
print(model_fit.summary())
