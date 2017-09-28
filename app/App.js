import Tools from "./lib/Tools";
import Environment from "./models/Environment";
import Trash from './models/Trash';
import Dirt from './models/Dirt';
import Agent from './models/Agent';
import $ from './vendor/jquery';

let environment;
let agents;

const populateEnvironment = (environmentSize) => {
    let numberOfFields = environmentSize * environmentSize;

    let numberOfAgents = Math.round((3 * numberOfFields) / 100);
    let numberOfOrganicTrash = Math.round((3 * numberOfFields) / 100);
    let numberOfGarbageTrash = Math.round((3 * numberOfFields) / 100);
    let numberOfOrganicDirt = Math.round((9 * numberOfFields) / 100);
    let numberOfGarbageDirt = Math.round((9 * numberOfFields) / 100);

    let fieldIdx;

    const setHoldInField = (qtt, newObj, params) => {
        let field;
        let obj;

        let tools = new Tools();
        let min, max;

        const callbackDrawNumber = (number) => {
            if (environment.fields[number].hold) {
                return tools.drawNumber(min, max, callbackDrawNumber);
            } else {
                return number;
            }
        };

        for (let i = 0; i < qtt; i++) {
            do {
                min = 0;
                max = numberOfFields - 1;

                fieldIdx = tools.drawNumber(min, max, callbackDrawNumber);
                field = environment.fields[fieldIdx];
            } while ((field.top === null || field.top && field.top.hold instanceof Trash) &&
            (field.right === null || field.right && field.right.hold instanceof Trash) &&
            (field.bottom === null || field.bottom && field.bottom.hold instanceof Trash) &&
            (field.left === null || field.left && field.left.hold instanceof Trash));

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

            environment.fields[fieldIdx].hold = obj;
            if (obj instanceof Agent) {
                agents.push(environment.fields[fieldIdx]);
            }
        }
    };

    agents = [];

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
};

const showEnvironment = () => {
    const tableEnv = $('#table-environment');
    const btnNextStep = $('.btn-next-step');
    let row = 0, col = 0;
    let environmentSize = environment.size;

    btnNextStep.hide();
    tableEnv.hide();

    tableEnv.find('tbody').remove();
    tableEnv.append('<tbody></tbody>');

    environment.fields.forEach((field) => {
        let fieldValue;

        if (col === 0) {
            $('#table-environment').append('<tr class="row-' + row + '"></tr>');
        }

        if (field.hold instanceof Agent) {
            fieldValue = 'A';
        } else if (field.hold) {
            fieldValue = field.hold.type;
        } else {
            fieldValue = '';
        }

        $('#table-environment .row-' + row).append('<td class="' + fieldValue.toLowerCase() + '">' + fieldValue + '</td>');

        if (row < environmentSize && col === (environmentSize - 1)) {
            row++;
        }
        // Controle de Col
        if (col !== (environmentSize - 1)) {
            col++;
        } else {
            col = 0;
        }
    });

    tableEnv.show();
    btnNextStep.show();
};

const generateEnvironment = (environmentSize) => {
    environment = new Environment(environmentSize);
    populateEnvironment(environmentSize);
    showEnvironment();
};

window.startAgents = () => {
    agents.forEach((agent, index) => {
        agents[index] = agent.hold.walk(agent);
    });

    showEnvironment(environment);
};

$(document).ready(() => {
    const generateEnvEl = $('#environment');

    generateEnvEl.on('submit', (e) => {
        e.preventDefault();
        let qtt = generateEnvEl[0].elements.qtt.value;
        generateEnvironment(qtt);
    });
});