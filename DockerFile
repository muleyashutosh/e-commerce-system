FROM python:3.9-slim

RUN mkdir /elcarto
WORKDIR /elcarto

ADD requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

ADD static /elcarto/static
ADD templates /elcarto/templates
ADD .env /elcarto
ADD .flaskenv /elcarto
ADD app.py /elcarto
ADD db_config.py /elcarto
ADD workbench.py /elcarto


LABEL maintainer="Ashutosh Muley <muleyashutosh@gmail.com>" \
      version="1.0"

CMD gunicorn app:app -b 0.0.0.0:8000


