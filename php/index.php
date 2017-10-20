<?php
  // ativa erros do PHP
  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);

  // inclui o TWIG e configura
  require_once 'vendor/autoload.php';
  $loader = new Twig_Loader_Filesystem('./');
  $twig = new Twig_Environment($loader, array(
    'debug' => true,
  ));
  $twig->addExtension(new Twig_Extension_Debug());

  // -------------------------------------------------------
  // ---------------------- Aplicação ----------------------
  // -------------------------------------------------------

  // inicializar aplicação
  $dados = $_GET;
  $tam = (array_key_exists('tam', $dados) ? $dados['tam'] : 8 );
  $ambiente = (array_key_exists('ambiente', $dados) ? json_decode($dados['ambiente'], true) : criaAmbiente($tam) );
  $lixeirasOrg = (array_key_exists('lixeirasOrg',$dados) ? json_decode($dados['lixeirasOrg'], true) : criaLixeiras('Lo') );
  $lixeirasSec = (array_key_exists('lixeirasSec',$dados) ? json_decode($dados['lixeirasSec'], true) : criaLixeiras('Ls') );
  $lixosOrg = (array_key_exists('lixosOrg',$dados) ? json_decode($dados['lixosOrg'], true) : criaLixos('O') );
  $lixosSec = (array_key_exists('lixosSec',$dados) ? json_decode($dados['lixosSec'], true) : criaLixos('S') );
  $agentes = (array_key_exists('agentes',$dados) ? json_decode($dados['agentes'], true) : criaAgentes() );
  $agenteAtual = (array_key_exists('agenteAtual',$dados) ? $dados['agenteAtual'] : 0 );
  $origemAgenteAtual = (array_key_exists('origemAgenteAtual',$dados) ? json_decode($dados['origemAgenteAtual'], true) : $agentes[$agenteAtual]['posicao'] );
  $passoAtual = (array_key_exists('passoAtual',$dados) ? $dados['passoAtual'] : 0 );

  if (array_key_exists('ambiente', $dados)) {
    if ($lixosOrg !== 0 && $lixosSec !== 0) {
      andaAgentes();
    } else {
      echo "nao ah lixos a serem coletados!";
    }
  }

  // cria o ambiente
  function criaAmbiente($tam) {
    $ambiente = array();

    for ($i = 0; $i < $tam; $i++) {
      for ($j = 0; $j < $tam; $j++) {
        $ambiente[$i][$j] = '';
      }
    }

    return $ambiente;
  }

  //cria lixeiras
  function criaLixeiras($tipo) {
    global $ambiente, $tam;
    $ttLixeiras = round((1.5 * ($tam * $tam)) / 100);
    $lixeiras = array();

    for ($i = 0; $i < $ttLixeiras; $i++) {
      do {
        $erros = false;
        $linha = rand(0, $tam - 1);
        $coluna = rand(0, $tam - 1);

        if ($ambiente[$linha][$coluna] === '') {
          $posicoesInvalidas = 0;

          if ($linha === 0 || $ambiente[$linha - 1][$coluna] !== '') {
            $posicoesInvalidas++;
          }

          if ($linha === $tam - 1 || $ambiente[$linha + 1][$coluna] !== '') {
            $posicoesInvalidas++;
          }

          if ($coluna === 0 || $ambiente[$linha][$coluna - 1] !== '') {
            $posicoesInvalidas++;
          }

          if ($coluna === $tam - 1 || $ambiente[$linha][$coluna + 1] !== '') {
            $posicoesInvalidas++;
          }

          if ($posicoesInvalidas <= 3) {
            $erros = true;
            $ambiente[$linha][$coluna] = $tipo;
            array_push($lixeiras, array('posicao' => array('linha' => $linha, 'coluna' => $coluna)));
          }
        }

      } while (!$erros);
    }

    return $lixeiras;
  }

  //cria lixos
  function criaLixos($tipo) {
    global $ambiente, $tam;
    $ttLixos = round((4.6 * ($tam * $tam)) / 100);
    $lixos = array();

    for ($i = 0; $i < $ttLixos; $i++) {
      do {
        $erros = false;
        $linha = rand(0, $tam - 1);
        $coluna = rand(0, $tam - 1);

        if ($ambiente[$linha][$coluna] === '') {
          $erros = true;
          $ambiente[$linha][$coluna] = $tipo;
          array_push($lixos, array('posicao' => array('linha' => $linha, 'coluna' => $coluna)));
        }

      } while (!$erros);
    }

    return $lixos;
  }

  //cria Agentes
  function criaAgentes () {
    global $ambiente, $tam;
    $ttAgentes = round((3 * ($tam * $tam)) / 100);
    $agentes = array();

    for ($i = 0; $i < $ttAgentes; $i++) {
      do {
        $erros = false;
        $linha = rand(0, $tam - 1);
        $coluna = rand(0, $tam - 1);

        if ($ambiente[$linha][$coluna] === '') {
          $erros = true;
          $ambiente[$linha][$coluna] = 'A';
          array_push($agentes,
            array(
              'posicao' => array(
                'linha' => $linha,
                'coluna' => $coluna
              ),
              'qtdLixosSec' => 0,
              'qtdLixosOrg' => 0
            )
          );
        }

      } while (!$erros);
    }

    return $agentes;
  }

  function andaAgentes() {
    global $ambiente, $agenteAtual, $passoAtual, $tam, $agentes, $lixeirasSec, $lixeirasOrg;

    $agenteLinha = $agentes[$agenteAtual]['posicao']['linha'];
    $agenteColuna = $agentes[$agenteAtual]['posicao']['coluna'];

    // $lados = array('cima','direita','baixo','esquerda');
    $lados = array('cima');

    for ($j= 0; $j < count($lados); $j++) {

      // cima
      if ($lados[$j] === 'cima') {
        if ($passoAtual < 2) {
          if ($agenteLinha === 0) {
            $passoAtual = $passoAtual + 2;
            break;
          }

          if ($ambiente[$agenteLinha - 1][$agenteColuna] === '') {
            $ambiente[$agenteLinha][$agenteColuna] = '';
            $ambiente[$agenteLinha - 1][$agenteColuna] = 'A';
            /*
            $agentes[$agenteAtual]['posicao']['linha'] = $agenteLinha - 1;
            $agentes[$agenteAtual]['posicao']['coluna'] = $agenteColuna;
            $ambiente[$agenteLinha - 1][$agenteColuna] = 'A';
            $ambiente[$agenteLinha][$agenteColuna] = '';
            */
            $passoAtual++;
            $agenteLinha--;
          }
        }
      }
      echo $passoAtual;
      // esquerda
      // baixo
      // Direita
    }
  }

    // Renderiza a aplicação
  $data['tam'] = $tam;
  $data['agenteAtual'] = $agenteAtual;
  $data['origemAgenteAtual'] = json_encode($origemAgenteAtual);
  $data['passoAtual'] = $passoAtual;

  $data['ambiente_view'] = $ambiente;
  $data['ambiente'] = json_encode($ambiente);
  $data['lixeirasOrg'] = json_encode($lixeirasOrg);
  $data['lixeirasSec'] = json_encode($lixeirasSec);
  $data['lixosOrg'] = json_encode($lixosOrg);
  $data['lixosSec'] = json_encode($lixosSec);
  $data['agentes'] = json_encode($agentes);

  echo $twig->render('page.html', $data);
?>
