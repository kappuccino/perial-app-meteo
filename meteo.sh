#!/bin/bash
set -e

PWD="$( cd "$(dirname "$0")" ; pwd -P )"
cd "$PWD"

DATE=`date '+%Y-%V'`

for city in "$@"
do
    echo "Meteo: $city"
	docker run --shm-size 1G --rm --env CITY=$city -v "$PWD":/app alekzonder/puppeteer:latest
	convert "images/meteo-$city.png" -crop 632x120+0+335 "images/meteo-$city-$DATE.png"
	rm -f "images/meteo-$city.png"
done


