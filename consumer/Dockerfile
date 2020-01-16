FROM python:3.6

WORKDIR /app
COPY ./worker.py ./losses.py ./requirements.txt ./download_model.sh ./
RUN pip install --upgrade pip && pip install -r requirements.txt && ./download_model.sh
CMD python ./worker.py
