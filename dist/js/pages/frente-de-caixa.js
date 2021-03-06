const url_api = $("#login-frente-de-caixa").data("api");

$(function () {
  fetch(url_api, {
    method: "POST",
    body: JSON.stringify({
      op: "configFrenteCaixa",
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      for (let o = 1; o <= data.qtd_pdv_caixa; o++) {
        let option = document.createElement("option");
        $(option).attr("value", o);
        $(option).append("CAIXA " + ("000" + o).slice(-3));
        $("#selectCaixa").append(option);
      }
    });
});

$(document).on("change", "#selectCaixa", function (e) {
  e.preventDefault();
  var numeroCaixa = $(this).val();
  fetch(url_api, {
    method: "POST",
    body: JSON.stringify({
      op: "verificaCaixaAberto",
      numeroCaixa: numeroCaixa,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (!data.status) {
        alert(data.msg);
      } else {
        if (!data.caixa_aberto) {
          $("#saldoInicialCaixa").css("display", "block");
          $("#saldoInicialCaixa").addClass("form-required");
        }
      }
    });
});

$(document).on("click", "#logarCaixaAberto", function (e) {
  e.preventDefault();
  var valida = validaForm({
    form: $("form[name='login-frente-de-caixa']"),
    notValidate: true,
    validate: true,
  });
  // if (valida) {
  //   $(".loading-bg-login").css("display", "flex");
  //   fetch(url_api, {
  //     method: "POST",
  //     body: JSON.stringify($("#login-frente-de-caixa").serialize()),
  //     headers: {
  //       "Content-type": "application/json; charset=UTF-8",
  //     },
  //   })
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => {});
  // }
});

// coloca o scroll da lsita de produtos da tabela no final da div

function tabs() {
  $(document).on("click", ".tabs button", function () {
    var active = $(this).hasClass("active");
    var data_id = $(this).data("id");
    if (active == false) {
      $(".tabs button").removeClass("active");
      $(this).addClass("active");
    }
    $(".opc_tabs").hide();
    $("#opc-tab_" + data_id).show();
  });
}

$(document).on("click", ".tipoPessoa", function () {
  var result = $('input[name="tipo_pessoa"]:checked').val();
  var url = $("#tipoPessoa").data("url");
  switch (result) {
    case "Fisica":
      $("#tipoPessoa").load(url + "pessoa-fisica.php");
      console.log(url + "pessoa-fisica.php");
      break;
    case "Juridica":
      $("#tipoPessoa").load(url + "pessoa-juridica.php");
      break;
    case "estrangeiro":
      $("#tipoPessoa").load(url + "estrangeiro.php");
      break;
  }
});

$(document).on("change", "#localiza_pedido", function () {
  var result = document.getElementById("localiza_pedido").value;
  switch (result) {
    case "data":
      $("input#input-localizar-pedido").removeClass("cpf");
      $("input#input-localizar-pedido").addClass("date");
      break;
    case "cpf":
      $("input#input-localizar-pedido").removeClass("date");
      $("input#input-localizar-pedido").addClass("cpf");
      break;
    default:
      $("input#input-localizar-pedido").removeClass("date");
      $("input#input-localizar-pedido").removeClass("cpf");
  }
});

$(document).on("change","#forma-pagamento", function () {
  var result = document.getElementById("forma-pagamento").value;
  $(".boxes-hide").hide();
  $("#parcela_"+result).show();
  $("#"+result).show();
});

$(document).on("change", "#login-frente-de-caixa", function () {
  var result = document.getElementById("opc_caixa").value;
  if (result == 1) {
    $("#login-frente-de-caixa").find(".addcaixa").show();
  } else {
    $("#login-frente-de-caixa").find(".addcaixa").hide();
  }
});

function editarCliente(e) {
  var id_edit = $(e).data("id");
  $(e).toggleClass("fa-times");
  $("#edit_" + id_edit).toggle();
}

function toggleFunction(e){
  var id_edit = $(e).data('id');
  $("#edit_"+id_edit).toggle();
 }

//Classe de Tecla de atalho
function shortKey() {
  this.key = [];
}
shortKey.prototype.add = function (aKey, aEvent, aPropagation, aID) {
  this.key.push(new key(aKey, aEvent, aPropagation, aID));
};
shortKey.prototype.run = function (e) {
  //Verificando no vetor todos os mapeamentos
  this.key.forEach(function (row, i) {
    if (
      e.keyCode === row.keyCode &&
      e.ctrlKey == row.ctrl &&
      e.altKey == row.alt &&
      e.shiftKey == row.shift
    ) {
      row.event(e);
      if (row.stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
      }
      // console.log(row);
    }
  });
};

//modais.add(112,82, nomeFuncao, true);
function key(key, event, propagation, idopc) {
  this.ctrl = key.ctrl || false;
  this.alt = key.alt || false;
  this.shift = key.shift || false;
  this.keyCode = key.key;
  this.event = event;
  this.stopPropagation = propagation || false;
  this.id = idopc || null;
  $(idopc).click(function (e) {
    event(e);
  });
}

function SelecionarVendedor(e){
  var url = $("#btn-vendedor").data('url');
  modal(url+'selecionar-vendedor.php');
}

function SelecionarCliente(e) {
  var url = $("#btn-cliente").data("url");
  modal(url + "selecionar-clientes.php");
}

function buscarProduto(e) {
  var url = $("#btn-buscar-produto").data("url");
  modal(url + "buscar-produto.php");
}

function localizarPedido(e) {
  var url = $("#btn-localizar_pedido").data("url");
  modal(url + "localizar-pedido.php");
}

function desconto(e) {
  var url = $("#btn-desconto").data("url");
  modal(url + "desconto.php");
}

function alterarItem(e) {
  var url = $("#btn-alterar-item").data("url");
  modal(url + "alterar-item.php");
}

function cancelarItem(e) {
  var url = $("#btn-cancelar-item").data("url");
  modal(url + "cancelar-item.php");
}

function consutarPreco(e) {
  var url = $("#btn-consultar-preco").data("url");
  modal(url + "consultar-preco.php");
}

function sangria(e) {
  var url = $("#btn-sangria").data("url");
  modal(url + "sangria.php");
}

function entradaValores(e) {
  var url = $("#btn-entrada-valores").data("url");
  modal(url + "entrada-de-valores.php");
}

function fecharCaixa(e){
  var url = $("#btn-fechar-caixa").data('url');
  modal(url+'fechar-caixa.php');
}

function agruparComanda(e) {
  var url = $("#btn-agrupar-comanda").data("url");
  modal(url + "agrupar-comanda.php");
}

function recebimentos(e) {
  var url = $("#btn-recebimentos").data("url");
  modal(url + "recebimentos.php");
}

function contaCorrente(e) {
  var url = $("#btn-conta-corrente").data("url");
  modal(url + "conta-corrente.php");
}

function devolucoes(e) {
  var url = $("#btn-devolucoes").data("url");
  modal(url + "devolucoes.php");
}

function modal(url) {
  $("#body-modal").html(" ");
  $("#body-modal").load(url);
  $("#ModalActions").modal({
    show: true,
  });
}

function closeModal() {
  $("#ModalActions").modal("hide");
}

$(function () {
  $(".loading-bg").css("display", "none");
  $(".navbar").css("display", "none");
  $("footer").css("display", "none");
  $(".layout-navbar-fixed").addClass("sidebar-collapse");
  $(".content-wrapper").css({ "margin-top": "0", "padding-bottom": "0" });

  //Evento de controle das teclas pressionadas
  //Verifique a funçãoi shortCut para maiores informações
  var modais = new shortKey();
  window.onkeydown = function (e) {
    modais.run(e);
  };

  modais.add({ key: 112 }, SelecionarVendedor, true, "#btn-vendedor"); // Tecla F1,
  modais.add({ key: 113 }, SelecionarCliente, true, "#btn-cliente"); // Tecla F2,
  modais.add({ key: 115 }, buscarProduto, true, "#btn-buscar-produto"); // Tecla F4,
  modais.add({ key: 116 }, localizarPedido, true, "#btn-localizar_pedido"); // Tecla F5,
  modais.add({ key: 117 }, desconto, true, "#btn-desconto"); // Tecla F6,
  modais.add({ key: 118 }, alterarItem, true, "#btn-alterar-item"); // Tecla F7,
  modais.add({ key: 119 }, cancelarItem, true, "#btn-cancelar-item"); // Tecla F8,
  modais.add({ key: 120 }, consutarPreco, true, "#btn-consultar-preco"); // Tecla F9,
  modais.add({ key: 83, ctrl: true }, sangria, true, "#btn-sangria"); // Tecla CTRL + ?,
  modais.add(
    { key: 69, ctrl: true },
    entradaValores,
    true,
    "#btn-entrada-valores"
  ); // Tecla CTRL + ?,
  modais.add({ key: 88, ctrl: true }, fecharCaixa, true, "#btn-fechar-caixa"); // Tecla CTRL + ?,
  modais.add(
    { key: 71, ctrl: true },
    agruparComanda,
    true,
    "#btn-agrupar-comanda"
  ); // Tecla CTRL + ?,
  modais.add({ key: 82, ctrl: true }, recebimentos, true, "#btn-recebimentos"); // Tecla CTRL + ?,
  modais.add(
    { key: 70, ctrl: true },
    contaCorrente,
    true,
    "#btn-conta-corrente"
  ); // Tecla CTRL + ?,
  modais.add({ key: 68, ctrl: true }, devolucoes, true, "#btn-devolucoes"); // Tecla CTRL + ?,
  tabs();
});
