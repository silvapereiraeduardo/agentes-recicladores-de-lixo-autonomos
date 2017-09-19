# Agentes Recicladores De Lixo Autônomos

## Problemática:
- Simular agentes recicladores de lixo autônomos.
- Para isso, vocês deverão construir um ambiente parametrizado, definido por uma matriz n x n (tal como 30 x 30) para ser o ambiente dos agentes (essa matriz deverá possuir até três tamanhos para escolha do usuário).
- Um ambiente de agente é apresentado na matriz abaixo.
- Os acontecimentos no ambiente serão medidos por ciclos.
- Um ciclo corresponde a uma atualização completa de todos os agentes do ambiente uma vez (abordagem sequencial).

A – Agente Reciclador de Lixo
Lo – Lixeira de Lixo Orgânico
Ls – Lixeira de Lixo Seco
O – Lixo Orgânico
S – Lixo Seco

Coexistem nesse ambiente:
### Agente Reciclador de Lixo (A)
- Ele é um agente reativo que se movimenta no ambiente, uma célula em qualquer direção a cada ciclo.
- Sua trajetória é por linha ou por coluna conforme a percepção de sujeira (diagonal não).
- Possui uma percepção de duas células em qualquer direção e sempre está à procura de sujeira para eliminar (direita, esquerda, acima ou abaixo).
- Se não encontrar sujeira, anda aleatoriamente em linha ou coluna, após 3 ciclos, ou seja, após verificar três vezes a sujeira ao seu redor.
- Ao encontrar sujeira coloca dentro do saco respectivo ao tipo de lixo (O agente recolhe o lixo ao ir para célula em que o lixo está), sendo assim apenas o Agente ocupa a mesma célula.
- Possui dois sacos de lixo, um para armazenar lixo orgânico e outro para armazenar lixo seco, cada saco possui uma determinada capacidade (ele é também um parâmetro) que quando enche deve ser esvaziado em uma das lixeiras do ambiente (lixo orgânico é descartado na lixeira de lixo orgânico e lixo seco é descartado na lixeira de lixo seco).
- O agente sempre procura a lixeira mais próxima para descarregar o lixo, pois possui uma pequena memória de controle, na qual ele guarda as coordenadas das lixeiras do ambiente.
- Agentes não podem ocupar a mesma célula que lixeiras e outros agentes, devendo assim desviar dos mesmos.

### Lixeira de Lixo Orgânico (Lo) e Lixeira de Lixo Seco (Ls)
- São agentes estáticos que o agente reciclador de lixo conhece a posição no ambiente (pode ser estática ou dinâmica a sua alocação).
- Possuem uma capacidade máxima (a ser definida), que quando atingida deixa de receber sujeira. A capacidade depende da quantidade de lixo que será disponibilizado no ambiente
- Cada agente só saberá a capacidade da lixeira ao visitá-la, sendo assim para conseguir descarregar o seu lixo é necessário ter espaço. A partir desse momento, cada agente que souber que essa lixeira está cheia, passará a desconsiderá-la e procurar por outra lixeira.

### Lixo Orgânico (O) e Lixo Seco (S)
- Estão espalhados no ambiente e devem ser recolhidos pelos agentes (aleatoriamente – faça sorteio para inserir na matriz).
- Cada célula poderá contém apenas um lixo, sendo ele orgânico ou seco.

## Observações da Implementação
- A simulação deve conter no mínimo 2 lixeiras (uma de cada tipo), 2 agentes e 6 lixos (6 lixos orgânicos e 6 lixos secos) aleatoriamente posicionados a cada execução.
- A matriz mínima deve ser de 8 x 8 (lembre-se que são três ambientes diferentes);
- Cada ambiente deve aumentar sua capacidade de lixos, lixeiras e agentes, de acordo com o tamanho da matriz (os lixos devem ter quantidades iguais).
- Cuide para que as lixeiras, no momento da inicialização, não fiquem inacessíveis (deve ser feita uma verificação, pois os agentes só podem chegar na lixeira se houver células livres).