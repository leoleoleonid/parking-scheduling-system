Test task description:

Parking scheduling system
The exercise is to build a simple scheduling engine for a parking lot, which allows reserving park
spaces via API (command line in this exercise) and REST API.
The application should read a map of parking spaces from a configuration file and maintain a
calendar, which will allow reserving the empty spaces.
1. Design and prepare a configuration file with a list of parking spaces
2. Write a program that receives events from stdin and reacts accordingly. The commands
   in CLI - “reserve yyyy-mm-ddThh:mm XYZ m” (for this event the system should return
   reservation id) and “clear <reservation id>” (should clear the reservation).
3. Additional supported commands
   a. status - returns current status (which spaces are available and taken now)
   b. status yyyy-mm-ddThh:mm - status at given time
   c. max-time yyyy-mm-ddThh:mm - a maximum duration available for reservation at
   a given time

4. Design and implement REST API that will allow similar functionality as the CLI.

# parking-scheduling-system

###To run this project do next in terminal:

``` bash
git clone https://github.com/leoleoleonid/parking-scheduling-system.git
cd ./parking-scheduling-system
npm i
```
## you can run it as REST API server or as CLI app

### To run it as server run this:
``` bash
npm run start-server
```

### To run it as CLI run this:
``` bash
npm run create-cli
```

###examples:
``` bash
scheduling reserve -d 2020-10-11T12:13 -p 321 -u 60
```
``` bash
scheduling clear -i 35o4923rudp9k27b2qqeza
```
``` bash
scheduling status -d 2020-10-11T12:13
```

PS: for `clear` command, you can use stdin to add command options. No need to put all options before runs the command.
