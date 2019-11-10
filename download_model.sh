#!/bin/bash
fileid="1XNAotDX55yM_rkFkk0-XfljA9CDnk9G9"
curl -c ./cookie -s -L "https://drive.google.com/uc?export=download&id=${fileid}" > /dev/null
curl -o- -Lb ./cookie "https://drive.google.com/uc?export=download&confirm=`awk '/download/ {print $NF}' ./cookie`&id=${fileid}" | tar xz