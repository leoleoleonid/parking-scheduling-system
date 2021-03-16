#!/usr/bin/env node

import yargs from 'yargs';
import readline from 'readline';
import SchedulingSystem from "./SchedulingSystem";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const availableCommands:(string|number)[] = ['clear', 'status', 'reserve'];

const argv = yargs.options({
    'date': { type: 'string', alias: 'd' },
    'place': { type: 'string', alias: 'p' },
    'duration': { type: 'number', alias: 'u' },
    'id': { type: 'string', alias: 'i' }
}).demandCommand(1).argv;

const command: (string|number)[] = argv._;

console.log('command', command);
console.log('options', argv);

if (!command.length) {
     console.log('not enough input arguments');
     console.log('available commands: [clear, status, reserve]')
     process.exit(1);
}

if (command.length > 1) {
    console.log('you are trying to pass extra arguments. only the first one will be in use');
}

if(!availableCommands.includes(command[0])) {
    console.log('no such command: ', command[0]);
    process.exit(1);
}

if (command[0] === 'status') {
    const date: string|undefined = argv['date'];
    (async () => {
        const schedulingSystem = await SchedulingSystem.create();
        const result:any = await schedulingSystem.status(date);
        console.log(result);
        if (result.error) {
            process.exit(1)
        }
    })();
}

if (command[0] === 'clear') {
    let id: string|undefined = argv['id'];
    if (!id) {
        rl.question("type id: ", async function(id) {
            console.log('newId', id);
            rl.close();
            const schedulingSystem = await SchedulingSystem.create();
            const result = await schedulingSystem.clear(id);
            console.log(result);
            if (result === 'no such id') {
                process.exit(1)
            }

        });
    } else {
        (async () => {
            const schedulingSystem = await SchedulingSystem.create();
            const result = await schedulingSystem.clear(id);
            console.log(result);
            if (result === 'no such id') {
                process.exit(1)
            }
        })()
        console.log('id', id);
    }
}

if (command[0] === 'reserve') {
    let date: string|undefined = argv['date'];
    let place: string|undefined = argv['place'];
    let duration: number|undefined = argv['duration'];

    if (!date || !place || !duration) {
        console.log('please, provide all params to reserver place');
    } else {
        (async () => {
            const schedulingSystem = await SchedulingSystem.create();
            const result = await schedulingSystem.reserve(date, place, duration);
            console.log(result);
            if (typeof result !== "string" ) {
                process.exit(1)
            }
        })();
    }
}

//
// console.log('args', args);
// console.log('process.argv.slice(2)!!!!!!!:K:LK:LKK');
// console.log(process.argv.slice(2));
// process.exit(1);
