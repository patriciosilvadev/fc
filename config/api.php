<?php

class ApiConnect
{

  public function envia($header = array(), $url, $tpRequisicao = 'POST', $conteudo = array())
  {

    try {
      //Inicializa cURL
      $ch = curl_init($url);

      if ($tpRequisicao == 'POST') {
        curl_setopt($ch, CURLOPT_POST, TRUE);
        //Passa o conteúdo para o campo de envio por POST
        curl_setopt($ch, CURLOPT_POSTFIELDS, $conteudo);
      }
      //Se foi passado como parâmetro, adiciona o cabeçalho à requisição
      if (!empty($header)) {

        $h = [];
        foreach ($header as $nome => $valor) {
          $h[] = $nome . ': ' . $valor;
        }

        curl_setopt($ch, CURLOPT_HTTPHEADER, $h);
      }

      //Marca que vai receber string
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

      // SSL VERIFY
      //curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

      //Inicia a conexão
      $resposta = curl_exec($ch);

      $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

      // Transforma em Array
      $resposta = json_decode($resposta, true);

      if (isset($resposta['code']) && ($resposta['code'] != 200 && $resposta['code'] != 201)) {
        $http_status = $resposta['code'];
      }

      $resposta['status_http'] = $http_status;

      //Fecha a conexão
      curl_close($ch);

      return $resposta;
    } catch (Exception $e) {

      return $e->getMessage();
    }
  }
}
