const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

interface SchedulingDataI {}
interface ValidReserveI {date: Date, place:number[], duration:number}

class SchedulingSystem {
    private schedulingData: SchedulingDataI;

    static async create() {
        const data:string = await readFile('../schedulingData.json');
        const schedulingData:SchedulingDataI = JSON.parse(data);
        return new SchedulingSystem(schedulingData)
    }

    constructor(schedulingData : SchedulingDataI) {
        this.schedulingData = schedulingData;
    }

    async reserve(date : any, place: any, duration: any = 1) {
        const isDateValid = this.isDateValid(date);
        const placeValid = this.returnPlaceValid(place);
        const durationValid = this.returnDurationValid(place);

        if (!isDateValid || !placeValid || !durationValid) {
            return {error: 'you provide incorrect data'};
        }
        const dateValid = this.returnDateValid(date);

        const reserveData = {date: dateValid, place: placeValid, duration: durationValid};

        const isPlaceFree = this.isPlaceFree(reserveData);
        if (!isPlaceFree) {
            return "this Place isn't free for this date";
        }
        const placeId = await this.addPlaceAndWriteToFile(reserveData);
        return placeId;
    }

    async clear(id: any) {
        if (!id) {
            return {error: 'you must provide id'}
        }
        const validId = this.returnValidId(id);
        if (!validId) {
            return {error: 'incorrect id'}
        }

        const deleteResultStatus = await this.deletePlaceAndWriteToFile(validId);
        return deleteResultStatus; // 'no such place' || 'success'
    }

    status(date: any) {
        let dateValid;

        if (date) {
            if (!this.isDateValid(date)) {
                return {error: 'invalid date'}
            }
            dateValid = this.returnDateValid(date);
        } else {
            dateValid = new Date();
        }

        const status = this.getStatus(dateValid);
        return status;

    }


    private async addPlaceAndWriteToFile(data:ValidReserveI) {
        const id = String(123123);
        return id;
    }

    private async deletePlaceAndWriteToFile(id: string) {
        return '';
    }

    private getStatus(date: Date) {
        return {}
    }

    private isPlaceFree(data:ValidReserveI) {
        return true;
    }

    private isDateValid(date: any) {
        return true
    }

    private returnDateValid(date: any) {
        return new Date();
    }

    private returnPlaceValid(place: any) {
        return [1,2,3] || false
    }

    private returnDurationValid(duration: any) {
        return 2 || false
    }

    private returnValidId(id: any) {
        return 'sdfvsdfv';
    }
}

export default SchedulingSystem;
