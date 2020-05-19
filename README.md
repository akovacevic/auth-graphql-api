
# Getting Started

update **.firebaserc** to point to the correct project

## Install Firebase Tools globally

    npm 'install -g firebase-tools'
    run 'firesbase login'
    run 'firebase use [firebase project name]

## Google Application Credentials and environment Variable
If you plan on running the project locally and want the necessary permissions.
**On Mac**:

    open ~/.bashrc

add the following line at the end of the file

    export GOOGLE_APPLICATION_CREDENTIALS= "<path to json file with google service account credentials>"

restart the terminal
**On Windows**:

    run $env:GOOGLE_APPLICATION_CREDENTIALS="<path to json file with google service account credentials>"

# Running Locally
run the following commands from the root directory

    cd functions
    npm install
    npm run serve

open browser to :  [http://localhost:5001/\[project name\]/\[project-location\]/auth-graphql](http://localhost:5001/)

# Testing
run the following commands from the root directory

    cd functions
    npm install
    npm test

# VSCode Debugging
create a launch.json file and paste the following configuration:

      {
           "version": "0.2.0",
           "configurations": [
    
               {
                   "type": "node",
                   "request": "attach",
                   "name": "Attach",
                   "port": 9229
               }
           ]
       }

run 
   

     npm run serve

add breakpoint to the file in **/src** you want to debug
go to the debugger in VSCode and run 'Attach'

# Deploy to Firebase

    npm run deploy
