#!/bin/sh

# Remove the `.template` extension from any files.
for f in `ls -a .env* *.template`; do mv $f ${f%.*}; done

# Setup python dependencies lock file.
pipenv install

echo "You must now add at least a Google Analytics ID and a Mapbox Token to `.env.local` to run locally"

# Initialize a new git repo
git init .
git add .
git commit
