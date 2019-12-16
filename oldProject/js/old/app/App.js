import Environment from "./models/Environment";
import Agent from './models/Agent';
import Dirt from './models/Dirt';
import $ from './vendor/jquery';
import Tools from "./lib/Tools";

let environment;

/**
 * Imprime o Ambiente
 */
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

/**
 * Gera o Ambiente
 * @param environmentSize - tamanho do Ambiente
 */
const generateEnvironment = (environmentSize) => {
    environment = new Environment(environmentSize);
    environment.populateEnvironment();
    showEnvironment();
};

$(document).ready(() => {
    const generateEnvEl = $('#environment');
    let intervalRunAgents;
    let tools = new Tools();
    let agentsIsRunning = false;
    let speed = 2000;
    /**
     * Inicializa os Agentes
     */
    window.startAgents = () => {
        const getFieldByInstance = (classInstance) => {
            return environment.fields.filter(field => field.hold instanceof classInstance);
        };

        let fieldsWithAgents = getFieldByInstance(Agent);
        let idx = 0;
        // variavel de teste
        let cont = 0;

        const runAgents = () => {
            let agent = fieldsWithAgents[idx].hold;

            agent.lookAround(fieldsWithAgents[idx]);
            showEnvironment(environment);

            console.log('idx: ' + idx, fieldsWithAgents[idx]);

            if (getFieldByInstance(Dirt).length && cont !== 10) {
                setTimeout(() => {
                    if (idx === (fieldsWithAgents.length - 1)) {
                        fieldsWithAgents = getFieldByInstance(Agent);
                        idx = 0;
                    } else {
                        idx++;
                    }
                    cont++;
                    runAgents();
                }, speed);
            }
        };

        runAgents();

        // const runAgents = () => {
        //     if (!agentsIsRunning) {
        //         fieldsWithAgents = environment.fields.filter(field => field.hold instanceof Agent);
        //         agentsIsRunning = true;
        //         field = fieldsWithAgents[i];
        //
        //         field.hold.walk(field);
        //         showEnvironment(environment);
        //
        //         if (environment.fields.filter(field => field.hold instanceof Dirt).length === 0) {
        //             agentsIsRunning = false;
        //             stopAgents();
        //         }
        //
        //         i = (i === (ttAgents - 1) ? 0 : (i + 1));
        //     }
        // };
        //
        // intervalRunAgents = setInterval(runAgents, speed);
    };
    /**
     * Chama a função de Gerar o Ambiente
     */
    generateEnvEl.on('submit', (e) => {
        e.preventDefault();
        let qtt = generateEnvEl[0].elements.qtt.value;
        speed = generateEnvEl[0].elements.speed.value;
        generateEnvironment(qtt);
    });
});