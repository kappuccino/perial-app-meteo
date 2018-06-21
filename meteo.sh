#!/bin/bash
set -e

cd "$(dirname "$0")"

DATE=`date '+%Y-%V'`

for city in "$@"
do
    echo "🔥 $city"    
	node index.js $city
	convert "images/meteo-$city.png" -crop 632x130+0+315 "images/meteo-$city-$DATE.png"
	rm -f "images/meteo-$city.png"
done
