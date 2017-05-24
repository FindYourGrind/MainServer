#!/bin/bash

sudo npm --prefix /var/app/current/client install
sudo npm --prefix /var/app/current/client run build
exit 0