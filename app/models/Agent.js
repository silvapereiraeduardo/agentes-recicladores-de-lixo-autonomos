import Tools from '../lib/Tools';
import Trash from './Trash';
import Dirt from "./Dirt";

export default class Agent {
    /**
     * Incializa o Agente
     * @param capacityOfOrganicDirt - Capacidade de lixos Orgânicos
     * @param capacityOfGarbageDirt - Capacidade de lixos Secos
     * @param slotOrganicDirt - Quantidade de lixos Orgânicos
     * @param slotDryDirt - Quantidade de lixos Secos
     */
    constructor(capacityOfOrganicDirt, capacityOfGarbageDirt, slotOrganicDirt, slotDryDirt) {
        this.capacityOfOrganicDirt = capacityOfOrganicDirt;
        this.capacityOfGarbageDirt = capacityOfGarbageDirt;
        this.slotOrganicDirt = slotOrganicDirt;
        this.slotDryDirt = slotDryDirt;
        this.direction = undefined;
        this.cycle = 0;
    }

    lookAround(actualField) {
        // debugger;
        let tools = new Tools();
        let drawNumberArray = ['top', 'right', 'bottom', 'left'];
        let tempDrawNumberArray = drawNumberArray;
        let min = 0;
        let max = 3;
        let tempMax = max;
        let agent = actualField.hold;
        let drawDirection;
        let test = false;
        const validateThisDirection = (field, direction) => {
            let isValid = true;

            if (field[direction] === null ||
                (
                    field[direction] &&
                    field[direction].hold &&
                    (
                        field[direction].hold instanceof Trash ||
                        field[direction].hold instanceof Agent
                    )
                )
            ) {
                isValid = false;
            }

            return isValid;
        };
        const getAgentDirection = number => {
            if (!validateThisDirection(actualField, actualField[tempDrawNumberArray[number]])) {
                tempMax--;
                tempDrawNumberArray = tempDrawNumberArray.filter((item, index) => {
                    return index !== number;
                });
                return tools.drawNumber(min, tempMax, getAgentDirection);
            }
            return tempDrawNumberArray[number];
        };

        if (agent.direction === undefined) {
            agent.direction = tools.drawNumber(min, tempMax, getAgentDirection);
            tempMax = max;
            tempDrawNumberArray = drawNumberArray;
        }

        do {
            drawDirection = tools.drawNumber(min, tempMax, number => {
                return tempDrawNumberArray[number];
            });

            tempDrawNumberArray = tempDrawNumberArray.filter(item => {
                return item !== drawDirection;
            });

            test = agent.verifyDirection(agent, actualField, drawDirection);

            tempMax--;
        } while (tempDrawNumberArray.length !== 0 && !test);

        tempMax = max;
        tempDrawNumberArray = drawNumberArray;

        if (!test) {
            if (agent.cycle < 2) {
                agent.cycle = agent.cycle + 1;
                agent.walk(actualField, actualField[agent.direction]);
            } else {
                agent.direction = undefined;
                agent.cycle = 0;
            }
        } else {
            agent.direction = undefined;
            agent.cycle = 0;
        }
    }

    /**
     * Caminha com o Agente
     * @param actualField - Campo do qual se encontra o Agente
     * @returns {field} - Campo do qual se encontra o Agente
     */
    verifyDirection(agent, actualField, direction) {
        // debugger;
        let tempField;
        let isValid = false;

        if (actualField[direction] === null) {
            return isValid;
        }

        for (let i = 0; i < 2; i++) {
            if (i === 0) {
                tempField = actualField[direction];
            }
            if (i === 1 && actualField[direction][direction] !== null) {
                tempField = actualField[direction][direction]
            }

            if (tempField.hold instanceof Dirt) {
                if (tempField.hold.type === 'O' && agent.slotOrganicDirt.length < agent.capacityOfOrganicDirt) {
                    agent.slotOrganicDirt.push(tempField.hold);
                    agent.walk(actualField, tempField);
                    isValid = true;
                    break;
                }
                if (tempField.hold.type === 'S' && agent.slotDryDirt.length < agent.capacityOfGarbageDirt) {
                    agent.slotDryDirt.push(tempField.hold);
                    agent.walk(actualField, tempField);
                    isValid = true;
                    break;
                }
            }

            if (tempField.hold instanceof Dirt) {
                if (tempField.hold.type === 'O' && agent.slotOrganicDirt.length < agent.capacityOfOrganicDirt) {
                    agent.slotOrganicDirt.push(tempField.hold);
                    agent.walk(actualField, tempField);
                    isValid = true;
                    break;
                }
                if (tempField.hold.type === 'S' && agent.slotDryDirt.length < agent.capacityOfGarbageDirt) {
                    agent.slotDryDirt.push(tempField.hold);
                    agent.walk(actualField, tempField);
                    isValid = true;
                    break;
                }
            }

            if (tempField.hold instanceof Trash) {
                if (tempField.hold.type === 'Lo' && agent.slotOrganicDirt.length === agent.capacityOfOrganicDirt) {
                    agent.slotOrganicDirt = [];
                    break;
                }
                if (tempField.hold.type === 'Ls' && agent.slotDryDirt.length === agent.capacityOfGarbageDirt) {
                    agent.slotDryDirt = [];
                    break;
                }
            }
        }

        return isValid;
    }

    walk(oldField, nextField) {
        oldField.hold = this;
        nextField.hold = oldField.hold;
        oldField.hold = null;
    }
};