#!/bin/bash
fileid="1u9xW76XTDs1p9AjAnAQv_h7MEl9wInJU"
curl -c ./cookie -s -L "https://drive.google.com/uc?export=download&id=${fileid}" > /dev/null
curl -o- -Lb ./cookie "https://drive.google.com/uc?export=download&confirm=`awk '/download/ {print $NF}' ./cookie`&id=${fileid}" | tar xz
rm -rf ./cookie
