import Agent from './Agent';
import Trash from './Trash';
import Field from './Field';

export default class Environment {
    constructor(size) {
        this.size = size;
        this.fields = Array(size * size).fill(new Field(undefined, undefined, undefined, undefined));

        let row = 0;
        let col = 0;
        let top, left, bottom, right;

        this.fields.forEach((field, index) => {
            // console.log('index', index);
            top = null;
            left = null;
            bottom = null;
            right = null;

            if (row !== 0) {
                top = this.getCoordenate(row - 1, col);
            }

            if (row !== this.size - 1) {
                bottom = this.getCoordenate(row + 1, col);
            }

            if (col !== 0) {
                left = this.getCoordenate(row, col - 1);
            }

            if (col !== this.size - 1) {
                right = this.getCoordenate(row, col + 1);
            }

            // seta posiçoes no campo
            this.fields[index] = new Field(top, left, bottom, right);
            // console.log(this.fields[index]);

            // Controle de Row
            if (row < this.size && col === (this.size - 1)) {
                row++;
            }
            // Controle de Col
            if (col !== (this.size - 1)) {
                col++;
            } else {
                col = 0;
            }
        });
    }

    getCoordenate(row, col) {
        return ((row + 1) * this.size) - (this.size - (col + 1)) -1;
    }
}