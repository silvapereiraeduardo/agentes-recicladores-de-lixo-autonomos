import Tools from '../lib/Tools';
import Trash from './Trash';
import Dirt from "./Dirt";

export default class Agent {
    constructor(capacityOfOrganicDirt, capacityOfGarbageDirt, slotOrganicDirt, slotDryDirt) {
        this.capacityOfOrganicDirt = capacityOfOrganicDirt;
        this.capacityOfGarbageDirt = capacityOfGarbageDirt;
        this.slotOrganicDirt = slotOrganicDirt;
        this.slotDryDirt = slotDryDirt;
        this.direction = undefined;
        this.cycle = 0;
    }

    walk(field) {
        let tools = new Tools();
        let drawNumberArray = ['top', 'right', 'bottom', 'left'];
        let newField = field;
        let agent = newField.hold;
        let min = 0;
        let max = 3;

        const callbackDrawNumber = (number) => {
            if (!field[drawNumberArray[number]]) {
                return tools.drawNumber(min, max, callbackDrawNumber);
            } else {
                return drawNumberArray[number];
            }
        };

        if (agent.direction !== null) {
            agent.direction = tools.drawNumber(min, max, callbackDrawNumber);
        }

        if (field[agent.direction].hold instanceof Dirt) {
            if (field[agent.direction].hold.type === 'O' && agent.slotOrganicDirt.length < agent.capacityOfOrganicDirt) {
                agent.slotOrganicDirt.push(field[agent.direction].hold);
                field[agent.direction].hold = agent;
                newField = field[agent.direction];
                field.hold = null;
            }
            if (field[agent.direction].hold.type === 'S' && agent.slotDryDirt.length < agent.capacityOfGarbageDirt) {
                agent.slotDryDirt.push(field[agent.direction].hold);
                field[agent.direction].hold = agent;
                newField = field[agent.direction];
                field.hold = null;
            }
        }

        if (field[agent.direction].hold instanceof Trash) {
            if (field[agent.direction].hold.type === 'Lo' && agent.slotOrganicDirt.length === agent.capacityOfOrganicDirt) {
                agent.slotOrganicDirt = [];
            }
            if (field[agent.direction].hold.type === 'Ls' && agent.slotDryDirt.length === agent.capacityOfGarbageDirt) {
                agent.slotDryDirt = [];
            }
        }

        if (field[agent.direction].hold === undefined) {
            field[agent.direction].hold = agent;
            newField = field[agent.direction];
            field.hold = null;
        }

        if (agent.cycle < 2) {
            agent.cycle = agent.cycle + 1;
        } else {
            agent.direction = undefined;
            agent.cycle = 0;
        }

        return newField;
    }
};