<?php

session_start();

// Arquivo com Funcoes de Banco de Dados
require "../config/database.php";
// Controller Login
require "../config/api.php";
// Arquivo com funcoes gerais do sistema
include "../includes/functions.php";

if (!isset($_REQUEST["op"]) || empty($_REQUEST["op"])) exit;

$Op = $_REQUEST["op"];

defined("LOGIN")  || define("LOGIN",  md5("login"));
defined("LOGOUT") || define("LOGOUT", md5("logout"));

// Modulo da API
$modulo = 'login';

$urlApi = API . $modulo;

$header = '';

$enderecoRetorno = ENDERECO;

// Muda de acordo com a chamada mas a maioria é post
$tpRequisicao = 'POST';

switch ($Op) {

  case LOGIN:

    $status = false;

    $msg = "Erro na tentativa de login, tente novamente mais tarde.";

    $dados = $_REQUEST;

    unset($dados['op']);

    $api = new apiConnect;

    $conteudo = $api->envia($header, $dados, $urlApi, $tpRequisicao);

    if (empty($conteudo)) {
      // Retorno Vazio seignifica que a API não está ativa ou servidor desligado
      $msg = "Não foi possível estabelecer conexão com o servidor.";
    } else if (isset($conteudo['error'])) {
      // Em caso de erro, retorna ao usuário exemplo: Login Inválido
      $msg = $conteudo['error'];
    } else {
      // Se tudo ocorrer bem, da a mensagem de boas vindas e grava a sessão do usuário
      session_cache_expire($conteudo['expires_in']);
      $_SESSION['user'] = $conteudo;
      $msg    = "Bem Vindo!";
      $status = true;
      $enderecoRetorno = $enderecoRetorno . '/home';
    }

    $retorno             = [];
    $retorno['endereco'] = $enderecoRetorno;
    $retorno['status']   = $status;
    $retorno['msg']      = $msg;

    echo json_encode($retorno);

    break;

  case LOGOUT:

    $status = false;
    $msg = "Não foi possível salvar sua categoria, tente novamente mais tarde.";

    $dados = $_REQUEST;

    $files = $_FILES;

    unset($dados['op']);

    $fields = '';
    $values = '';

    $last = count($dados);
    $i = 0;

    foreach ($dados as $key => $d) {
      $fields .= $key;
      $values .= "'" . $d . "'";
      if ($i < ($last - 1)) {
        $fields .= ', ';
        $values .= ', ';
      }
      $i++;
    }

    // Paramentros FUNCAO SQL
    $tabela = 'categoriaproduto';

    if (DBInsert($tabela, $fields, $values)) {
      $status = true;
      $msg    = "Dados Salvos com Sucesso!";
    }

    $endereco = ENDERECO_ADMIN . '/produto/categoria';

    $retorno             = [];
    $retorno['endereco'] = $endereco;
    $retorno['status']   = $status;
    $retorno['msg']      = $msg;

    echo json_encode($retorno);

    break;



    $status = false;

    $msg = 'Erro ao alterar status!';

    $dados = $_REQUEST;

    $action = $dados['action'];

    $campos = [];

    switch ($action) {
      case 'ativar':
        $campos['statusProduto'] = 1;
        break;

      case 'inativar':
        $campos['statusProduto'] = 0;
        break;

      default:
        $msg = 'Novo Status não DEFINIDO.';
        break;
    }

    $where = "WHERE idProduto=" . $dados['idProduto'];

    $tabela = 'produto';

    if (DBUpdate($tabela, $campos, $where)) {

      $status = true;

      $msg = 'Status Alterado com Sucesso!';
    }

    $retorno             = [];
    $retorno['status']   = $status;
    $retorno['msg']      = $msg;

    echo json_encode($retorno);

    break;

  default:
    // $retorno             = [];
    // $retorno['endereco'] = ENDERECO_ADMIN;
    // $retorno['status']   = false;
    // $retorno['msg']      = "Nenhuma ação definida.";

    echo json_encode($retorno);
}
