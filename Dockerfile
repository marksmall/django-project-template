FROM python:3.6

LABEL project "<PROJECT NAME>"
LABEL subproject "<SUB-PROJECT NAME>"

ARG COMMIT_HASH="undefined"
ARG GIT_BRANCH="undefined"
ENV COMMIT_HASH=$COMMIT_HASH
ENV GIT_BRANCH=$GIT_BRANCH
ENV PROJECT_DIR=/opt/<PROJECT NAME>/<SUB-PROJECT NAME>
ENV MANAGE_PY=$PROJECT_DIR/manage.py
ENV PYTHONPATH=/usr/local/bin
ENV DJANGO_SETTINGS_MODULE=core.settings

WORKDIR $PROJECT_DIR

COPY Pipfile Pipfile.lock /

RUN apt update && apt install -y postgresql-client python3-gdal && \
  rm -rf /var/lib/apt/lists/* && \
  pip3 install -U pipenv && \
  pipenv install

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["-w"]

EXPOSE 8888:8888

COPY . .
