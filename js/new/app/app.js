import $ from 'jquery';

let tam;
let velocidade;
let lixeirasOrg = Array();
let lixeirasSec = Array();
let lixosOrg = Array();
let lixosSec = Array();
let agentes = Array();
let ambiente = Array();
let passo = null;
let direcoes = ['baixo', 'esquerda', 'cima', 'direita'];
let agenteAtual = null;
let origemAgenteAtual = null;
let direcaoAtual = null;
let trocaAgente = false;
let contDirecoes = 0;
let controleCiclo = Array();
let intervaloTempo;

const validaPosicao = (linha, coluna) => {
    let test = false;
    let posicoesValidas = 0;

    if (ambiente[linha][coluna] === '') {
        if (linha !== 0 && ambiente[linha - 1][coluna] === '') {
            posicoesValidas++;
        }
        if (linha !== tam - 1 && ambiente[linha + 1][coluna] === '') {
            posicoesValidas++;
        }
        if (coluna !== 0 && ambiente[linha][coluna - 1] === '') {
            posicoesValidas++;
        }
        if (coluna !== tam - 1 && ambiente[linha][coluna + 1] === '') {
            posicoesValidas++;
        }
    }

    if (posicoesValidas !== 0) {
        test = true;
    }

    return test;
};

const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// cria ambiente
const criaAmbiente = (tam) => {
    let test;
    let i, j;
    let linha;
    let coluna;
    let obj;
    let criador = [
        {
            'id': 'Lo',
            'qtd': Math.round((((1 * 100) / (8 * 8)) * (tam * tam)) / 100)
        },
        {
            'id': 'Ls',
            'qtd': Math.round((((1 * 100) / (8 * 8)) * (tam * tam)) / 100)
        },
        {
            'id': 'O',
            'qtd': Math.round((((6 * 100) / (8 * 8)) * (tam * tam)) / 100)
        },
        {
            'id': 'S',
            'qtd': Math.round((((6 * 100) / (8 * 8)) * (tam * tam)) / 100)
        },
        {
            'id': 'A',
            'qtd': Math.round((((2 * 100) / (8 * 8)) * (tam * tam)) / 100)
        }

    ];

    lixeirasOrg = Array();
    lixeirasSec = Array();
    lixosOrg = Array();
    lixosSec = Array();
    agentes = Array();
    ambiente = Array();
    passo = null;
    agenteAtual = null;
    origemAgenteAtual = null;
    direcaoAtual = null;
    trocaAgente = false;
    contDirecoes = 0;
    controleCiclo = Array();

    for (i = 0; i < tam; i++) {
        ambiente.push(Array());
        for (j = 0; j < tam; j++) {
            ambiente[i].push('');
        }
    }

    criador.forEach((item) => {
        for (j = 0; j < item['qtd']; j++) {
            do {
                linha = getRandomIntInclusive(0, tam - 1);
                coluna = getRandomIntInclusive(0, tam - 1);
                test = validaPosicao(linha, coluna);
            } while (!test);

            ambiente[linha][coluna] = item['id'];
            if (item['id'] !== 'A') {
                obj = {'posicao': {linha: linha, coluna: coluna}};
            } else {
                obj = {
                    'posicao': {linha: linha, coluna: coluna},
                    'qtdLixosOrg': 0,
                    'qtdLixosSec': 0
                };

                controleCiclo.push({
                    'ciclo': 0,
                    'direcao': direcoes[0]
                });
            }

            if (item['id'] === 'Lo') {
                lixeirasOrg.push(obj);
            } else if (item['id'] === 'Ls') {
                lixeirasSec.push(obj);
            } else if (item['id'] === 'S') {
                lixosSec.push(obj);
            } else if (item['id'] === 'O') {
                lixosOrg.push(obj);
            } else {
                agentes.push(obj);
            }
        }
    });
};

// move para cima
const moveAgenteParaCima = (agenteLinha, agenteColuna) => {
    ambiente[agenteLinha][agenteColuna] = '';
    ambiente[agenteLinha - 1][agenteColuna] = 'A';
    agentes[agenteAtual]['posicao']['linha'] = agenteLinha - 1;
    agentes[agenteAtual]['posicao']['coluna'] = agenteColuna;
};

// move para direita
const moveAgenteParaDireita = (agenteLinha, agenteColuna) => {
    ambiente[agenteLinha][agenteColuna] = '';
    ambiente[agenteLinha][agenteColuna + 1] = 'A';
    agentes[agenteAtual]['posicao']['linha'] = agenteLinha;
    agentes[agenteAtual]['posicao']['coluna'] = agenteColuna + 1;
};

// move para baixo
const moveAgenteParaBaixo = (agenteLinha, agenteColuna) => {
    ambiente[agenteLinha][agenteColuna] = '';
    ambiente[agenteLinha + 1][agenteColuna] = 'A';
    agentes[agenteAtual]['posicao']['linha'] = agenteLinha + 1;
    agentes[agenteAtual]['posicao']['coluna'] = agenteColuna;
};

// move para esquerda
const moveAgenteParaEsquerda = (agenteLinha, agenteColuna) => {
    ambiente[agenteLinha][agenteColuna] = '';
    ambiente[agenteLinha][agenteColuna - 1] = 'A';
    agentes[agenteAtual]['posicao']['linha'] = agenteLinha;
    agentes[agenteAtual]['posicao']['coluna'] = agenteColuna - 1;
};

// move para origem
const moveAgenteParaOrigem = (agenteLinha, agenteColuna) => {
    let linhaOrigem = origemAgenteAtual['posicao']['linha'];
    let colunaOrigem = origemAgenteAtual['posicao']['coluna'];

    ambiente[agenteLinha][agenteColuna] = '';
    ambiente[linhaOrigem][colunaOrigem] = 'A';
    agentes[agenteAtual]['posicao']['linha'] = linhaOrigem;
    agentes[agenteAtual]['posicao']['coluna'] = colunaOrigem;
};

// anda Agente
const andaAgente = (direcaoAtual) => {
    console.log('--- andaAgente ---');

    if (passo === 2) {
        moveAgenteParaOrigem(agentes[agenteAtual]['posicao']['linha'], agentes[agenteAtual]['posicao']['coluna']);
        passo = 0;
    } else {
        let agenteLinha = agentes[agenteAtual]['posicao']['linha'];
        let agenteColuna = agentes[agenteAtual]['posicao']['coluna'];

        switch (direcaoAtual) {
            case 'cima' : {
                if (agenteLinha === 0) {
                    passo = 2;
                } else {
                    if (ambiente[agenteLinha - 1][agenteColuna] === '') {
                        moveAgenteParaCima(agenteLinha, agenteColuna);
                        passo++;
                    } else {
                        if (ambiente[agenteLinha - 1][agenteColuna] === 'O' && agentes[agenteAtual]['qtdLixosOrg'] < 3) {
                            agentes[agenteAtual]['qtdLixosOrg']++;
                            moveAgenteParaCima(agenteLinha, agenteColuna);
                            trocaAgente = true;
                        } else if (ambiente[agenteLinha - 1][agenteColuna] === 'S' && agentes[agenteAtual]['qtdLixosSec'] < 3) {
                            agentes[agenteAtual]['qtdLixosSec']++;
                            moveAgenteParaCima(agenteLinha, agenteColuna);
                            trocaAgente = true;
                        } else if (ambiente[agenteLinha - 1][agenteColuna] === 'Lo' && agentes[agenteAtual]['qtdLixosOrg'] === 3) {
                            agentes[agenteAtual]['qtdLixosOrg'] = 0;
                            trocaAgente = true;
                        } else if (ambiente[agenteLinha - 1][agenteColuna] === 'Ls' && agentes[agenteAtual]['qtdLixosSec'] === 3) {
                            agentes[agenteAtual]['qtdLixosSec'] = 0;
                            trocaAgente = true;
                        } else {
                            passo = 2;
                        }
                    }
                }
                break;
            }
            case 'baixo' : {
                if (agenteLinha === tam - 1) {
                    passo = 2;
                } else {
                    if (ambiente[agenteLinha + 1][agenteColuna] === '') {
                        moveAgenteParaBaixo(agenteLinha, agenteColuna);
                        passo++;
                    } else {
                        if (ambiente[agenteLinha + 1][agenteColuna] === 'O' && agentes[agenteAtual]['qtdLixosOrg'] < 3) {
                            agentes[agenteAtual]['qtdLixosOrg']++;
                            moveAgenteParaBaixo(agenteLinha, agenteColuna);
                            trocaAgente = true;
                        } else if (ambiente[agenteLinha + 1][agenteColuna] === 'S' && agentes[agenteAtual]['qtdLixosSec'] < 3) {
                            agentes[agenteAtual]['qtdLixosSec']++;
                            moveAgenteParaBaixo(agenteLinha, agenteColuna);
                            trocaAgente = true;
                        } else if (ambiente[agenteLinha + 1][agenteColuna] === 'lo' && agentes[agenteAtual]['qtdLixosOrg'] === 3) {
                            agentes[agenteAtual]['qtdLixosOrg'] = 0;
                            trocaAgente = true;
                        } else if (ambiente[agenteLinha + 1][agenteColuna] === 'ls' && agentes[agenteAtual]['qtdLixosSec'] === 3) {
                            agentes[agenteAtual]['qtdLixosSec'] = 0;
                            trocaAgente = true;
                        } else {
                            passo = 2;
                        }
                    }
                }
                break;
            }
            case 'direita' : {
                if (agenteColuna === tam - 1) {
                    passo = 2;
                } else {
                    if (ambiente[agenteLinha][agenteColuna + 1] === '') {
                        moveAgenteParaDireita(agenteLinha, agenteColuna);
                        passo++;
                    } else {
                        if (ambiente[agenteLinha][agenteColuna + 1] === 'O' && agentes[agenteAtual]['qtdLixosOrg'] < 3) {
                            agentes[agenteAtual]['qtdLixosOrg']++;
                            moveAgenteParaDireita(agenteLinha, agenteColuna);
                            trocaAgente = true;
                        } else if (ambiente[agenteLinha][agenteColuna + 1] === 'S' && agentes[agenteAtual]['qtdLixosSec'] < 3) {
                            agentes[agenteAtual]['qtdLixosSec']++;
                            moveAgenteParaDireita(agenteLinha, agenteColuna);
                            trocaAgente = true;
                        } else if (ambiente[agenteLinha][agenteColuna + 1] === 'lo' && agentes[agenteAtual]['qtdLixosOrg'] === 3) {
                            agentes[agenteAtual]['qtdLixosOrg'] = 0;
                            trocaAgente = true;
                        } else if (ambiente[agenteLinha][agenteColuna + 1] === 'ls' && agentes[agenteAtual]['qtdLixosSec'] === 3) {
                            agentes[agenteAtual]['qtdLixosSec'] = 0;
                            trocaAgente = true;
                        } else {
                            passo = 2;
                        }
                    }
                }
                break;
            }
            case 'esquerda' : {
                if (agenteColuna === 0) {
                    passo = 2;
                } else {
                    if (ambiente[agenteLinha][agenteColuna - 1] === '') {
                        moveAgenteParaEsquerda(agenteLinha, agenteColuna);
                        passo++;
                    } else {
                        if (ambiente[agenteLinha][agenteColuna - 1] === 'O' && agentes[agenteAtual]['qtdLixosOrg'] < 3) {
                            agentes[agenteAtual]['qtdLixosOrg']++;
                            moveAgenteParaEsquerda(agenteLinha, agenteColuna);
                            trocaAgente = true;
                        } else if (ambiente[agenteLinha][agenteColuna - 1] === 'S' && agentes[agenteAtual]['qtdLixosSec'] < 3) {
                            agentes[agenteAtual]['qtdLixosSec']++;
                            moveAgenteParaEsquerda(agenteLinha, agenteColuna);
                            trocaAgente = true;
                        } else if (ambiente[agenteLinha][agenteColuna - 1] === 'lo' && agentes[agenteAtual]['qtdLixosOrg'] === 3) {
                            agentes[agenteAtual]['qtdLixosOrg'] = 0;
                            trocaAgente = true;
                        } else if (ambiente[agenteLinha][agenteColuna - 1] === 'ls' && agentes[agenteAtual]['qtdLixosSec'] === 3) {
                            agentes[agenteAtual]['qtdLixosSec'] = 0;
                            trocaAgente = true;
                        } else {
                            passo = 2;
                        }
                    }
                }
                break;
            }
        }
        console.log('agente atual: ', agentes[agenteAtual]);
    }
    console.log('passo: ' + passo);
};

// pega lixeira mais próxima
const pegaLixeiraProxima = (agente, tipoLixeira) => {
    let novaDirecao;
    let lixeiras = (tipoLixeira === 'Lo' ? lixeirasOrg : lixeirasSec);
    let agenteLinha = agente['posicao']['linha'];
    let agenteColuna = agente['posicao']['coluna'];
    let lixeiraProxima;

    lixeiras = lixeiras.map((item, index) => {
        let itemLinha = item['posicao']['linha'];
        let itemColuna = item['posicao']['coluna'];
        let ttPassos = 0;

        if (itemLinha > agenteLinha) {
            ttPassos += itemLinha - agenteLinha;
        } else {
            ttPassos += agenteLinha - itemLinha;
        }

        if (itemColuna > agenteColuna) {
            ttPassos += itemColuna - agenteColuna;
        } else {
            ttPassos += agenteColuna - itemColuna;
        }

        return {
            'index': index,
            'posicao': item['posicao'],
            'ttPassos': ttPassos - 1
        };
    });

    lixeiras.sort((a, b) => {
        let test;
        if (a['ttPassos'] > b['ttPassos']) {
            test = 1;
        } else if (a['ttPassos'] < b['ttPassos']) {
            test = -1;
        } else {
            test = 0;
        }
        return test;
    });

    lixeiras.reverse();

    lixeiraProxima = lixeiras[0];

    if (lixeiraProxima['posicao']['linha'] > agenteLinha && ambiente[agenteLinha + 1][agenteColuna] === '') {
        novaDirecao = 'baixo';
    } else if (lixeiraProxima['posicao']['linha'] < agenteLinha && ambiente[agenteLinha - 1][agenteColuna] === '') {
        novaDirecao = 'cima';
    } else if (lixeiraProxima['posicao']['coluna'] > agenteColuna && ambiente[agenteLinha][agenteColuna + 1] === '') {
        novaDirecao = 'direita';
    } else if (lixeiraProxima['posicao']['coluna'] < agenteColuna && ambiente[agenteLinha][agenteColuna - 1] === '') {
        novaDirecao = 'esquerda';
    }

    console.log('lixeiras', lixeiras);

    return novaDirecao;
};

// pega próxima posicao
const pegaProximaPosicao = (agente) => {
    let novaDirecao;
    let agenteLinha = agente['posicao']['linha'];
    let agenteColuna = agente['posicao']['coluna'];
    let direcoesPossiveis = Array();

    if (agente['qtdLixosOrg'] === 3) {
        novaDirecao = pegaLixeiraProxima(agente, 'Lo');
    } else if (agente['qtdLixosSec'] === 3) {
        novaDirecao = pegaLixeiraProxima(agente, 'Ls');
    } else {
        direcoesPossiveis = direcoes.filter((item) => {
            let test = false;
            if (controleCiclo['direcao'] !== item) {
                if (item === 'cima' && agenteLinha !== 0 && ambiente[agenteLinha - 1][agenteColuna] === '') {
                    test = true;
                } else if (item === 'baixo' && agenteLinha !== (tam - 1) && ambiente[agenteLinha + 1][agenteColuna] === '') {
                    test = true;
                } else if (item === 'esquerda' && agenteColuna !== 0 && ambiente[agenteLinha][agenteColuna - 1] === '') {
                    test = true;
                } else if (item === 'direita' && agenteColuna !== (tam - 1) && ambiente[agenteLinha][agenteColuna + 1] === '') {
                    test = true;
                }
            }
            return test;
        });

        novaDirecao = direcoesPossiveis[Math.floor(Math.random() * direcoesPossiveis.length)];
    }

    return novaDirecao;
};

// mostra o ambiente
const mostraAmbiente = () => {
    let element = $('#app');
    let content;
    let i, j;
    let agenteIndex = 0;

    console.log('-- mostraAmbiente --');
    console.log(ambiente);

    element.empty();
    content = "<table><tbody>";

    for (i = 0; i < ambiente.length; i++) {
        content += "<tr>";
        for (j = 0; j < ambiente.length; j++) {
            if (ambiente[i][j] === 'A') {
                agentes.forEach((agente, index) => {
                    if (agente['posicao']['linha'] === i && agente['posicao']['coluna'] === j) {
                        agenteIndex = index + 1;
                    }
                });
                content += "<td class='" + ambiente[i][j] + "'>" + ambiente[i][j] + agenteIndex + "</td>";
            } else {
                content += "<td class='" + ambiente[i][j] + "'>" + ambiente[i][j] + "</td>";
            }
        }
        content += "</tr>";
    }

    content += "</tbody></table>";
    element.append(content);

    // mostra painel
    element = $('#painel');
    content = '';

    element.empty();
    content = "<table><tbody>";

    content += "<tr><td class='titulo' colspan='2'>Lixos Orgânicos</td></tr>";
    content += "<tr><td colspan='2'>" + lixosOrg.length + "</td></tr>";

    content += "<tr><td class='titulo' colspan='2'>Lixos Secos</td></tr>";
    content += "<tr><td colspan='2'>" + lixosSec.length + "</td></tr>";

    content += "<tr><td class='titulo' colspan='2'>Passo</td></tr>";
    content += "<tr><td colspan='2'>" + (passo === null ? 0 : passo) + "</td></tr>";

    content += "<tr><td class='titulo' colspan='2'>Direção Atual</td></tr>";
    content += "<tr><td colspan='2'>" + (direcaoAtual === null ? 'Sem Direção' : direcaoAtual) + "</td></tr>";

    agentes.forEach((agente, index) => {
        content += "<tr><td class='titulo' colspan='2'>Agente " + (index + 1) + "</td></tr>";
        content += "<tr>";
        content += "<td>Posição</td>";
        content += "<td>Linha: " + agente['posicao']['linha'] + "<br>Coluna: " + agente['posicao']['coluna'] + "</td>";
        content += "</tr>";
        content += "<tr>";
        content += "<td>Quantidade de lixos</td>";
        content += "<td>Orgânicos: " + agente['qtdLixosOrg'] + "<br>Secos: " + agente['qtdLixosSec'] + "</td>";
        content += "</tr>";
        content += "<tr>";
        content += "<td>Controle de Ciclo</td>";
        content += "<td>Ciclo: " + controleCiclo[index]['ciclo'] + "<br>Direção: " + controleCiclo[index]['direcao'] + "</td>";
        content += "</tr>";
    });

    content += "</tbody></table>";
    element.append(content);
};

// proximo Passo
const proximoPasso = () => {
    if (lixosOrg.length === 0 && lixosSec === 0) {
        clearInterval(intervaloTempo);
        window.alert('Não à mais lixos a serem recolhidos!');
        return;
    }

    console.log('--- proximoPasso ---');

    if (trocaAgente) {
        passo = 0;
        direcaoAtual = direcoes[0];
        contDirecoes = 0;
        agenteAtual = (agenteAtual + 1 < agentes.length ? agenteAtual + 1 : 0);
        origemAgenteAtual = {
            'posicao': {
                'linha': agentes[agenteAtual]['posicao']['linha'],
                'coluna': agentes[agenteAtual]['posicao']['coluna']
            }
        };
        trocaAgente = false;
    } else {
        if (direcaoAtual === null) {
            direcaoAtual = direcoes[0];
            contDirecoes = 0;
        }

        if (agenteAtual === null) {
            agenteAtual = 0;
        }

        if (origemAgenteAtual === null) {
            origemAgenteAtual = {
                'posicao': {
                    'linha': agentes[agenteAtual]['posicao']['linha'],
                    'coluna': agentes[agenteAtual]['posicao']['coluna']
                }
            };
        }

        if (passo === null) {
            passo = 0;
        } else if (passo === 0) {
            direcaoAtual = (direcoes.indexOf(direcaoAtual) + 1 < direcoes.length ? direcoes[direcoes.indexOf(direcaoAtual) + 1] : direcoes[0]);

            if (contDirecoes < 3) {
                contDirecoes++;
            } else {
                let novaLinha = agentes[agenteAtual]['posicao']['linha'];
                let novaColuna = agentes[agenteAtual]['posicao']['coluna'];

                contDirecoes = 0;

                if (controleCiclo[agenteAtual]['ciclo'] === 2) {
                    controleCiclo[agenteAtual]['ciclo'] = 0;
                    controleCiclo[agenteAtual]['direcao'] = pegaProximaPosicao(agentes[agenteAtual]);
                    console.log(controleCiclo[agenteAtual]['direcao']);
                } else {
                    controleCiclo[agenteAtual]['ciclo']++;

                    if (
                        (controleCiclo[agenteAtual]['direcao'] === 'cima' && (novaLinha === 0 || ambiente[novaLinha - 1][novaColuna] !== '')) ||
                        (controleCiclo[agenteAtual]['direcao'] === 'baixo' && (novaLinha === tam - 1 || ambiente[novaLinha + 1][novaColuna] !== '')) ||
                        (controleCiclo[agenteAtual]['direcao'] === 'esquerda' && (novaColuna === 0 || ambiente[novaLinha][novaColuna - 1] !== '')) ||
                        (controleCiclo[agenteAtual]['direcao'] === 'direita' && (novaColuna === tam - 1 || ambiente[novaLinha][novaColuna + 1] !== ''))
                    ) {
                        controleCiclo[agenteAtual]['ciclo'] = 0;
                        controleCiclo[agenteAtual]['direcao'] = pegaProximaPosicao(agentes[agenteAtual]);
                    }
                }

                switch (controleCiclo[agenteAtual]['direcao']) {
                    case 'cima' : {
                        novaLinha--;
                        break;
                    }
                    case 'direita' : {
                        novaColuna++;
                        break;
                    }
                    case 'baixo' : {
                        novaLinha++;
                        break;
                    }
                    case 'esquerda' : {
                        novaColuna--;
                        break;
                    }
                }

                origemAgenteAtual = {'posicao': {'linha': novaLinha, 'coluna': novaColuna}};
                passo = 2;
                trocaAgente = true;
            }
        }
    }

    andaAgente(direcaoAtual);
    mostraAmbiente();
};

const iniciaPassos = () => {
    intervaloTempo = setInterval(proximoPasso, velocidade);
};

$(document).ready(() => {
    $('#config-ambiente').on('submit', (e) => {
        e.preventDefault();
        tam = $('#config-ambiente')[0].elements.tam.value;
        velocidade = $('#config-ambiente')[0].elements.velocidade.value;

        criaAmbiente(tam);
        mostraAmbiente();
    });
});

window.proximoPasso = proximoPasso;
window.iniciaPassos = iniciaPassos;
