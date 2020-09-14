#!/bin/sh

amazon-linux-extras install -y docker
systemctl start dockersystemctl enable docker