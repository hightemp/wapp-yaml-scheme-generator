#!/bin/bash

echo "window.aDefaultSchemes = [];" > default_schemes_list.js
for i in $(echo ./schemes/*); do
    b=$(basename $i)
    c=$(cat $i)
    echo "window.aDefaultSchemes.push({ sName: \"$b\", sValue: \`$c\` });" >> default_schemes_list.js
done