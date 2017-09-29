import Environment from "./models/Environment";
import Agent from './models/Agent';
import $ from './vendor/jquery';

let environment;
let agents;

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
    agents = [];
    environment = new Environment(environmentSize);
    environment.populateEnvironment();

    environment.fields.forEach((field) => {
        if (field.hold instanceof Agent) {
            agents.push(field);
        }
    });

    showEnvironment();
};

$(document).ready(() => {
    const generateEnvEl = $('#environment');
    let nIntervalId;

    window.startAgents = () => {
        let i = 0;
        const task = () => {
            agents.forEach((agent, index) => {
                agents[index] = agent.hold.walk(agent);
                console.log(i, agent);
            });

            showEnvironment(environment);
            i++;
        };

        nIntervalId = window.setInterval(task, 1000);
    };

    window.stopAgents = () => {
        window.clearTimeout(nIntervalId);
    };

    generateEnvEl.on('submit', (e) => {
        e.preventDefault();
        let qtt = generateEnvEl[0].elements.qtt.value;
        generateEnvironment(qtt);
    });
});