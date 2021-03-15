const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const path = require('path');

const MINUTE = 60*1000;
const STORAGE_PATH = path.join(__dirname, '../schedulingData.json');

interface SchedulingDataI {
    [key: string]: {date: string, duration: number, place: number[]}
}

// duration HOURS

interface ValidReserveI {date: Date, place:number[], duration:number}

class SchedulingSystem {
    private schedulingData: SchedulingDataI;

    static async create() {
        const data:string = await readFile(STORAGE_PATH);
        const schedulingData:SchedulingDataI = data.length ? JSON.parse(data) : {};
        return new SchedulingSystem(schedulingData)
    }

    constructor(schedulingData : SchedulingDataI) {
        this.schedulingData = schedulingData;
    }

    async reserve(date : any, place: any, duration: any = 1) {
        const isDateValid = this.isDateValid(date);
        const placeValid = this.returnPlaceValid(place);
        const durationValid = this.returnDurationValid(duration);
        if (!isDateValid || !placeValid || !durationValid) {
            return {error: 'you provide incorrect data'};
        }
        const dateValid = this.returnDate(date);

        const reserveData = {date: dateValid, place: placeValid, duration: durationValid};

        const isFree = this.isPlaceFree(reserveData);
        if (!isFree) {
            return "this Place isn't free for this date";
        }

        return await this.addPlaceAndWriteToFile(reserveData);
    }

    async clear(id: any) {
        if (!id) {
            return {error: 'you must provide id'}
        }
        const validId = this.returnValidId(id);
        if (!validId) {
            return {error: 'incorrect id'}
        }

        return await this.deletePlaceAndWriteToFile(validId);
    }

    status(date: any) {
        let dateValid;

        if (date) {
            if (!this.isDateValid(date)) {
                return {error: 'invalid date'}
            }
            dateValid = this.returnDate(date);
        } else {
            dateValid = new Date();
        }

        return this.getStatus(dateValid.toISOString());
    }

    private async addPlaceAndWriteToFile(data:ValidReserveI) {
        const {date, place, duration} = data;
        const id = this.randomId();
        this.schedulingData[id] = {date: date.toISOString(), place, duration};

        try {
            await writeFile(STORAGE_PATH, JSON.stringify(this.schedulingData));
        } catch (e) {
            console.error(e)
        }

        return id;
    }

    private async deletePlaceAndWriteToFile(id: string) {
        if (this.schedulingData[id]) {
            delete this.schedulingData[id];
            try {
                await writeFile(STORAGE_PATH, JSON.stringify(this.schedulingData));
            } catch (e) {
                console.error(e)
            }

            return 'success';
        }

        return 'no such id';
    }

    private getStatus(statusDate: string) {
        const status = [];
        for (const {date, place} of Object.values(this.schedulingData)) {
            if (statusDate === date) {
                status.push(place);
            }
        }

        return status;
    }

    private isPlaceFree(data:ValidReserveI) {
        // new           -____-
        //current -____-

        // new   -____-
        //current       -______-

        for (const {date, duration, place} of Object.values(this.schedulingData)) {
            const isPlace = JSON.stringify(place) === JSON.stringify(data.place);
            if (isPlace) {
                const existentStart = this.returnDate(date).getTime();
                const existentEnd = this.returnDate(date).getTime()  + duration * MINUTE;
                const newStart = data.date.getTime();
                const newEnd = data.date.getTime()  + duration * MINUTE;

                const newFinishEarlierThanExistentStart
                    = existentStart > newEnd;

                const newStartLaterThanExistentFinish
                    = existentEnd < newStart;

                const isFree = (newFinishEarlierThanExistentStart)
                    || (newStartLaterThanExistentFinish);

                if (!isFree) {
                    return false;
                }
            }
        }

        return true;
    }

    //validation
    private isDateValid(date: any) {
        if (typeof date !== 'string' ){
            return false;
        }

        //2021-10-04T12:13
        //for simplicity
        if (date.length !== 'yyyy-mm-ddThh:mm'.length) {
            return false;
        }

        return true
    }

    private returnDate(date: string) {
        // date.toISOString()
        return new Date(Date.parse(date));
    }

    private returnPlaceValid(place: any) {
        if (typeof place !== 'string' || place.length !== 3){
            return false;
        }

        return place.split("").map(i => Number(i));
    }

    private returnDurationValid(duration: any) {
        return Number(duration);
    }

    private returnValidId(id: any) {
        return typeof id === 'string' ? id : false;
    }

    private randomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

}

export default SchedulingSystem;
