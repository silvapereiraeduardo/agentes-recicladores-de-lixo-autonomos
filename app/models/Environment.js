import Tools from '../lib/Tools';
import Field from './Field';
import Trash from './Trash';
import Dirt from './Dirt';
import Agent from './Agent';

export default class Environment {
    constructor(size) {
        this.size = size;
        this.fields = Array(size * size).fill({});

        this.fields.forEach((field, index, fields) => {
            fields[index] = new Field(undefined, undefined, undefined, undefined, undefined);
        });

        const getCoordenate = (row, col) => {
            return ((row + 1) * this.size) - (this.size - (col + 1)) - 1;
        };

        let row = 0;
        let col = 0;
        let top, left, bottom, right;

        this.fields.forEach((field, index, fields) => {
            top = null;
            left = null;
            bottom = null;
            right = null;

            if (row !== 0) {
                top = fields[getCoordenate(row - 1, col)];
            }

            if (row !== this.size - 1) {
                bottom = fields[getCoordenate(row + 1, col)];
            }

            if (col !== 0) {
                left = fields[getCoordenate(row, col - 1)];
            }

            if (col !== this.size - 1) {
                right = fields[getCoordenate(row, col + 1)];
            }

            // seta posiçoes no campo

            field.top = top;
            field.right = right;
            field.bottom = bottom;
            field.left = left;

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

    populateEnvironment() {
        let environment = this;
        let numberOfFields = this.size * this.size;
        let numberOfAgents = Math.round((3 * numberOfFields) / 100);
        let numberOfOrganicTrash = Math.round((3 * numberOfFields) / 100);
        let numberOfGarbageTrash = Math.round((3 * numberOfFields) / 100);
        let numberOfOrganicDirt = Math.round((9 * numberOfFields) / 100);
        let numberOfGarbageDirt = Math.round((9 * numberOfFields) / 100);
        let drawFild;

        const setHoldInField = (qtt, newObj, params) => {
            let tools = new Tools();
            let field;
            let obj;
            let min = 0;
            let max = numberOfFields - 1;

            const callbackDrawNumber = (number) => {
                let tempField = environment.fields[number];
                if ((tempField.top === null || tempField.top.hold instanceof Trash) &&
                    (tempField.right === null || tempField.right.hold instanceof Trash) &&
                    (tempField.bottom === null || tempField.bottom.hold instanceof Trash) &&
                    (tempField.left === null || tempField.left.hold instanceof Trash)) {
                    return tools.drawNumber(min, max, callbackDrawNumber);
                }

                return tempField;
            };

            for (let i = 0; i < qtt; i++) {
                field = tools.drawNumber(min, max, callbackDrawNumber);

                switch (newObj) {
                    case 'Trash' : {
                        obj = new Trash(params.param1);
                        break;
                    }
                    case 'Dirt' : {
                        obj = new Dirt(params.param1);
                        break;
                    }
                    case 'Agent' : {
                        obj = new Agent(params.param1, params.param2, params.param3, params.param4);
                        break;
                    }
                }

                field.hold = obj;
            }
        };

        // seta as Lixeiras
        setHoldInField(numberOfOrganicTrash, 'Trash', {
            param1: 'Lo'
        });
        setHoldInField(numberOfGarbageTrash, 'Trash', {
            param1: 'Ls'
        });
        // seta os Lixos
        setHoldInField(numberOfOrganicDirt, 'Dirt', {
            param1: 'O'
        });
        setHoldInField(numberOfGarbageDirt, 'Dirt', {
            param1: 'S'
        });
        // seta os Agents
        setHoldInField(numberOfAgents, 'Agent', {
            param1: 1,
            param2: 1,
            param3: [],
            param4: []
        });
    }
}