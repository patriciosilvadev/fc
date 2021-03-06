// Submit Login

$(document).on("click", "#submitlogin", function (e) {
  e.preventDefault();
  var url = $(this).data("url");
  var valida = validaForm({
    form: $("form[name='login']"),
    notValidate: true,
    validate: true,
  });
  if (valida) {
    // Abro Div de carregamento
    $(".loading-bg-login").css("display", "flex");
    $.ajax({
      url: url,
      type: "post",
      dataType: "json",
      data: $("#login").serialize(),
    }).done(function (e) {
      // Fecho a div de carregamento e dou o retorno ao usuário
      $(".loading-bg-login").css("display", "none");
      if (e.status) {
        window.location.replace(e.endereco);
      } else {
        Swal.fire("Erro!", e.msg, "error");
      }
    });
  }
});
