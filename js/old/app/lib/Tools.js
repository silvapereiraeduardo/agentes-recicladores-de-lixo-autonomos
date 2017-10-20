export default class Tools {
    drawNumber(min, max, callback) {
        min = Math.ceil(min);
        max = Math.floor(max);
        let element = Math.floor(Math.random() * (max - min + 1)) + min;
        return callback(element);
    }

    sleep(milliseconds) {
        let start = new Date().getTime();
        for (let i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }
}