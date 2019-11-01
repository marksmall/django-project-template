#!/bin/sh

# Remove the `.template` extension from any files.
for f in `find . -name \*.template`; do mv $f ${f%.*}; done

# Setup python dependencies lock file.
cd server && pipenv install

echo "You must now add at least a Google Analytics ID and a Mapbox Token to `.env.local` to run locally"

cd ..

# Initialize a new git repo
git init .
git add .
git reset setup.sh
git commit
