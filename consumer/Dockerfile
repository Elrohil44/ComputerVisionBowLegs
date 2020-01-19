FROM python:3.6

WORKDIR /app
COPY ./requirements.txt ./download_model.sh ./
RUN pip install --upgrade pip && pip install -r requirements.txt && ./download_model.sh
COPY ./worker.py ./losses.py ./
CMD python -u ./worker.py
