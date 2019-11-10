FROM python:3.7

WORKDIR /app
COPY ./server ./models ./requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt
CMD python server/server.py

EXPOSE 5000
