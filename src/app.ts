import express from 'express';
import * as bodyParser from 'body-parser';
import SchedulingSystem from './SchedulingSystem'

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/reserve', async (req,res) => {
    const schedulingSystem = await SchedulingSystem.create();
    const {date, place, duration} = req.body;
    const result = await schedulingSystem.reserve(date, place, duration);
    res.send({result});
});

app.get('/clear/:id', async (req,res) => {
    const id = req.params.id;
    const schedulingSystem = await SchedulingSystem.create();
    const result = await schedulingSystem.clear(id);
    res.send({result});
});

app.get('/status', async (req,res) => {
    const schedulingSystem = await SchedulingSystem.create();
    const result = await schedulingSystem.status(undefined);
    res.send({result});
});

app.get('/status/:dateString', async (req,res) => {
    const dateString = req.params.dateString;
    const schedulingSystem = await SchedulingSystem.create();
    const result = await schedulingSystem.status(dateString);
    res.send({result});
});

export {app};
