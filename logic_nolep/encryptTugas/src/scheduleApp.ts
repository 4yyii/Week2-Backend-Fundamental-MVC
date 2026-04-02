import moment from 'moment';

export const scheduleTask = () => {
    const time = moment().add(7, 'd');
    console.log(`Schedule task for: ${time}`);
}