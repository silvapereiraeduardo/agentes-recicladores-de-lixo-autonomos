import Tools from '../lib/Tools';
import Trash from './Trash';
import Dirt from "./Dirt";

export default class Agent {
    constructor(capacityOfOrganicDirt, capacityOfGarbageDirt, slotOrganicDirt, slotGarbageDirt) {
        this.capacityOfOrganicDirt = capacityOfOrganicDirt;
        this.capacityOfGarbageDirt = capacityOfGarbageDirt;
        this.slotOrganicDirt = slotOrganicDirt;
        this.slotGarbageDirt = slotGarbageDirt;
        this.direction = undefined;
        this.cycle = 0;
    }

    walk(field) {
        let newField = field;
        let agent = newField.hold;
        let tools = new Tools();
        let min = 0;
        let max = 3;
        let drawNumberArray = ['top', 'right', 'bottom', 'left'];

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
            if (field[agent.direction].hold.type === 'S' && agent.slotGarbageDirt.length < agent.capacityOfGarbageDirt) {
                agent.slotGarbageDirt.push(field[agent.direction].hold);
                field[agent.direction].hold = agent;
                newField = field[agent.direction];
                field.hold = null;
            }
        }

        if (field[agent.direction].hold instanceof Trash) {
            if (field[agent.direction].hold.type === 'Lo' && agent.slotOrganicDirt.length === agent.capacityOfOrganicDirt) {
                agent.slotOrganicDirt = [];
            }
            if (field[agent.direction].hold.type === 'Ls' && agent.slotGarbageDirt.length === agent.capacityOfGarbageDirt) {
                agent.slotOrganicDirt = [];
            }
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