# botRC

    % npm install
    % grunt
    % node api

Then open url :
    http://localhost:3000/

# Test

    % curl -H "Content-Type:application/json" --data '{"leftSpeed":-10,"rightSpeed":20,"battery":10,"ram":0,"heading":0,"servoPos":0,"distance":32}'  -X POST localhost:3000/emit

# Tip

Run this to automaticaly check js lint and build webapp when a file is modified:

    % grunt watch
