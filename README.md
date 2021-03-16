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
