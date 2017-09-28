export default class Tools {
    drawNumber(min, max, callback) {
        min = Math.ceil(min);
        max = Math.floor(max);
        let element = Math.floor(Math.random() * (max - min + 1)) + min;
        return callback(element);
    }
}