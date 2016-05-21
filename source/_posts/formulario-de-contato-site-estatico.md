title: "Criando um formulário de contato para um site estático"
date: 2016-05-20 19:31:42
tags: 
   - Hexo
keywords:
   - hexo
   - Blog
   - Static website
   - contact form
   - fomulário
---
Sites estáticos são legais por muitos motivos. São rápidos, seguros já que não há interação com o servidor, são fáceis de gerenciar e criar com ferramentas como [Hexo][hx] e [Jekyll][j]. Mas todas essas benesses não vêm sem um custo. Um típico formulário de contato é impossível de ser implementado em sites totalmente estáticos. Será?
<!-- more -->
Com o serviço [Formspree][fp] basta submeter seu formulário para o endereço [formspree.io/seu@email.com.br](https://formspree.io/seu@email.com.br) e receber os dados do formulário diretamente em sua caixa postal. Simples, fácil e grátis! 

Veja o formulário básico:

{% codeblock lang:html %}
    <form action="https://formspree.io/your@email.com" method="POST">
    <input type="text" name="name">
    <input type="email" name="_replyto">
    <input type="submit" value="Send">
    </form>
{% endcodeblock %}

## Integrando com o Hexo ##

### Modo rápido (e feio!) ###

No [Hexo][hx] basta criar uma página (não um post) chamado contato:

`$ hexo new page contato`

Uma página nova será criada em `source/contato/index.md`, edite esse arquivo para conter algo similar a:

{% codeblock source/contato/index.md lang:markdown %}
    title: Contato
    layout: page
    ---
    Deixa sua mensagem!

    <form action="https://formspree.io/your@email.com"
      method="POST">
    <input type="text" name="name">
    <input type="email" name="_replyto">
    <input type="submit" value="Send">
    </form>
{% endcodeblock %}

Nesse ponto o formulário já funciona e pode ser acessado em `http://seu.dominio.com/contato/`. Mas vamos melhorar um pouco a experiência do usuário acrescentando uma página personalizada de sucesso após o envio da mensagem. Para isso vamos criar o arquivo `source/contato/sucesso.md`.

{% codeblock source/contato/sucesso.md lang:markdown %}
    title: Contato
    layout: page
    ---
    Obrigado por nos enviar uma mensagem!
{% endcodeblock %}

E acrescentamos um campo escondido ao formulário no arquivo `source/contato/index.md`. 
*(mais detalhes sobre os campos escondidos veja o site [formspree.io][fp])*

`<input type="hidden" name="_next" value="//seu.dominio.com/contato/sucesso.html" />`

Esse campo não aparece para o usuário e instrui o [formspree][fp] a retornar para a página de sucesso depois de enviar o formulário.

Pronto! O formulário de contato está integrado ao site.

#### Pontos negativos ####

* O endereço e-mail fica aberto à *scrappers*, porém colocar um `mailto:` no site teria o mesmo efeito. Também, as ferramentas de e-mail modernas são muito boas em filtrar spam.
* Esse método oferece pouco controle sobre a apresentação do formulário, isso porque o Hexo irá interpretar o arquivo `.md` como markdown. Isso não altera diretamente o código HTML do formulário mas torna difícil controlar o resultado final.
* O resultado pode variar muito de acordo com o tema utilizado. Essas variações podem não ser agradáveis.

Uma alternativa para ter mais controle sobre a apresentação do formulário é criar o HTML completo ao invés de um `.md`. O Hexo vai apenas copiar o HTML para o site final. Mas isso requer cópia da estrutura gerada pelo Hexo para dentro do HTML manualmente afim de fazê-lo se parecer com uma página do site. Manter a sincronia dos arquivos pode se tornar trabalhoso.

Outra saída é personalizar o tema. Explicarei os detalhes de como fazer isso na [parte 2][p2] desse artigo.

#### [continua...][p2] ####

[hx]: https://hexo.io
[j]: https://jekyllrb.com
[fp]: https://formspree.io
[p2]: /2016/05/formulario-de-contato-site-estatico-pt2