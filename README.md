# Get started

    % npm install
    % grunt
    % node api

Then open url :
    http://localhost:3000/

# How does it work

You can use it with a small arduino bluetooth controlled robot.
Here you can find the sketch of a working Zumo robot.

    https://github.com/jtbonhomme/MyZumoBot

# Test

To start a bluetooth connection

    % curl -H "Content-Type:application/json" --data '{"address": "20-13-05-07-38-71", "channel": 1}'  -X POST localhost:3000/bluetooth

To set left motor speed equal to 5

    % curl -H "Content-Type:application/json" --data '{"value":5}'  -X POST localhost:3000/robot/leftSpeed

To post an entire configuration

    % curl -H "Content-Type:application/json" --data '{"leftSpeed":-10,"rightSpeed":20,"battery":10,"ram":0,"heading":0,"servoPos":0,"distance":32}'  -X POST localhost:3000/robot

# Server installation

    

# Tip

Run this to automaticaly check js lint and build webapp when a file is modified:

    % grunt watch

# Thanks

* https://github.com/aterrien/jQuery-Knob

# Todo

1. handle bluetooth disconnections
2. add bluetooth inquire
