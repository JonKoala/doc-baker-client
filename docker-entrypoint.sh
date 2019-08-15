#!/bin/bash

npm run build
http-server dist -g -p $DOCBAKER_CLIENT_PORT -P http://localhost:$DOCBAKER_CLIENT_PORT?
