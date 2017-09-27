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

    const drawPosition = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        let drawElement = Math.floor(Math.random() * (max - min + 1)) + min;

        if (environment.fields[drawElement].hold) {
            return drawPosition(min, max);
        } else {
            return drawElement;
        }
    };

    const setHoldInField = (qtt, element) => {
        let field;

        for (let i = 0; i < qtt; i++) {
            do {
                fieldIdx = drawPosition(0, numberOfFields - 1);
                field = environment.fields[fieldIdx];
            } while ((field.top === null || field.top && field.top.hold instanceof Trash) &&
            (field.right === null || field.right && field.right.hold instanceof Trash) &&
            (field.bottom === null || field.bottom && field.bottom.hold instanceof Trash) &&
            (field.left === null || field.left && field.left.hold instanceof Trash));

            environment.fields[fieldIdx].hold = element;
            if (element instanceof Agent) {
                agents.push(environment.fields[fieldIdx]);
            }
        }
    };

    agents = [];

    // seta as Lixeiras
    setHoldInField(numberOfOrganicTrash, new Trash('Lo'));
    setHoldInField(numberOfGarbageTrash, new Trash('Ls'));
    // seta os Lixos
    setHoldInField(numberOfOrganicDirt, new Dirt('O'));
    setHoldInField(numberOfGarbageDirt, new Dirt('S'));
    // seta os Agents
    setHoldInField(numberOfAgents, new Agent(0, 0));
};

const generateEnvironment = (environmentSize) => {
    let row = 0, col = 0;
    environment = new Environment(environmentSize);

    populateEnvironment(environmentSize);

    environment.fields.forEach((field, index, fields) => {
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

        $('#table-environment .row-' + row).append('<td>' + fieldValue + '</td>');

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
};

window.nextStep = () => {
    agents.forEach((agent) => {
        console.log(agent);
    });
};

$(document).ready(() => {
    const generateEnvEl = $('#environment');
    const tableEnv = $('#table-environment');
    const btnNextStep = $('.btn-next-step');

    generateEnvEl.on('submit', (e) => {
        btnNextStep.hide();
        tableEnv.hide();

        let qtt = generateEnvEl[0].elements.qtt.value;

        e.preventDefault();

        tableEnv.find('tbody').remove();
        tableEnv.append('<tbody></tbody>');

        generateEnvironment(qtt);

        tableEnv.show();
        btnNextStep.show();
    });
});