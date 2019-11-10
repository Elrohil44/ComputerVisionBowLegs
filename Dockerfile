FROM python:3.7

WORKDIR /app
COPY ./server/ ./server/
COPY ./models/ ./models/
COPY ./requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt
CMD python server/server.py

EXPOSE 5000
