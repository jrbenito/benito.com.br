title: "Criando um formulário de contato para um site estático - Parte 2"
date: 2016-05-20 23:30:25
updated: 2016-06-01 22:30:00
tags: 
   - Hexo
keywords:
   - hexo
   - Blog
   - Static website
   - contact form
   - fomulário
   - layout
---
Na {% post_link formulario-de-contato-site-estatico parte 1 %} desse artigo nós criamos um formulário HTML dentro de uma página [Hexo][hx]. O formulário envia os dados para um e-mail através do serviço [Formspree][fp].

Hoje iremos integrar o formulário ao tema e assim ganhar controle da apresentação do formulário podendo adicionar estilos e scripts e aproveitar as facilidades que seu tema disponibiliza. O tema que escolhi para meu blog é o [Tranquilpeak][tp] e os exemplo abaixo serão baseados em sua estrutura. Porém, é fácil extrapolar isso para o tema de sua escolha.
<!-- more -->
## Layout ##

As páginas `source/contato/index.md` e `source/contato/sucesso.md` criadas na {% post_link formulario-de-contato-site-estatico parte 1 %} utilizam o layout *page*. Esse layout é obrigatório em todos os temas Hexo. Como o nome sugere ele difere do layout *post* e é voltado para criação de páginas do site. No [Tranquilpeak][tp] v1.7.1 (mais atual enquanto escrevo esse artigo), o layout page contém:

{% codeblock layout/page.ejs %}
    <%- partial('_partial/post', {post: page}) %>
{% endcodeblock %}

A função `partial` carrega um outro arquivo passando o objeto JSON `{post: page}`. Esse modelo de carga de arquivos parciais é bastante poderoso como veremos a seguir. Alteraremos o arquivo acima para ficar assim:

{% codeblock layout/page.ejs %}
    <% if (page.path.indexOf('contato') > -1){ %>
        <%- partial('_partial/contact', {post: page}) %>
    <% } else { %>
        <%- partial('_partial/post', {post: page}) %>
    <% } %>
{% endcodeblock %}

Nessa nova versão, toda página com layout page poderá ter carregado o layout `layout/_partial/post.ejs`ou o layout `layout/_partial/contact.ejs` dependendo do caminho na URL do site. Toda página cujo endereço contiver a palavra *contato* carregará o layout específico para páginas de contato, todas as outras continuam como antes. O arquivo `layout/_partial/contact.ejs` não existe no tema [Tranquilpeak][tp] e devemos criá-lo:

{% codeblock layout/_partial/contact.ejs %}
    <article class="post" itemscope itemType="http://schema.org/BlogPosting">
    <% if (post.coverCaption) { %>
        <span class="post-header-cover-caption caption"><%= post.coverCaption %></span>
    <% } %>
    <% if (!post.coverImage || post.coverMeta === 'out') { %>
        <%- partial('contact/header')%>
    <% } %>
    <div class="post-content markdown" itemprop="articleBody">
        <div class="main-content-wrap">
            <%- post.content %>
            <br>
            <% if (post.form) { %>
                <%- partial('contact/form') %>
            <% } %>
        </div>
    </div>
    </article>
{% endcodeblock %}

O conteúdo foi extraído, com pouca modificação, do `layout/_partial/post.ejs`, assim a formatação fica similar. Utilizando um `<DIV>`com classe *"main-content-wrap"*, herdamos a formatação da área de conteúdo do site. E a linha `<%- post.content %>` é responsável por preencher o `<DIV>` com o conteúdo do arquivo `.md` já traduzido de *markdown* para HTML. Através da condição `<% if (post.form) { %>`, a variável `form` controla a inserção do conteúdo do arquivo `layout/_partial/contact/form`. 

{% codeblock layout/_partial/contact/form.ejs %}
    <form action="https://formspree.io/<%= theme.author.email %>" method="POST">
        <input type="text" name="name">
        <input type="email" name="_replyto">
        <input type="submit" value="Send">
    </form>
{% endcodeblock %}

Repare na utilização da variável provida pelo tema `theme.author.email` para preencher o action do formulário. Dessa forma a solução fica mais portável. Os arquivo `source/contato/index.md` e `source/contato/sucesso.md` alterados estão abaixo. O formulário migrou do arquivo de markdown `contato/index.md` para o layout `form.ejs` e foi acrescentada a variável form ao *front-matter*.

{% codeblock source/contato/index.md %}
    title: Contato
    layout: page
    form: true
    ---
    Deixa sua mensagem!
{% endcodeblock %}

{% codeblock source/contato/sucesso.md %}
    title: Contato
    layout: page
    form: false
    ---
    Obrigado por nos enviar uma mensagem!
{% endcodeblock %}

Eu particularmente não gosto que a data de postagem seja incluída junto ao título da página de contato. Retirei ela criando um novo cabeçalho para as páginas de contato em `layout/_partial/contact/header`.

{% codeblock layout/_partial/contact/header %}
    <div class="post-header main-content-wrap <%= (post.metaAlignment ? 'text-' + post.metaAlignment : 'text-left') %>">
    <% if (post.link) { %>
        <h1 itemprop="headline">
            <a class="link" href="<%- url_for(post.link) %>" target="_blank" itemprop="url">
            <%= post.title || '(' + __('post.no_title') + ')' %>
            </a>
        </h1>
    <% } else { %>
        <h1 class="post-title" itemprop="headline">
            <%= post.title || '(' + __('post.no_title') + ')' %>
        </h1>
    <% } %>
    </div>
{% endcodeblock %}

### Conclusão ###

O que foi apresentado até aqui integra o formulário HTML ao conteúdo do site, permite que os arquivo `.md` controlem o conteúdo das páginas mas delega o layout do formulário ao tema. Ainda é preciso criar alguns estilos `CSS` para os campos e legendas pois o [Tranquilpeak][tp] não prevê o uso de campos de formulário. Porém, utilizando o tema dessa forma fica simples reaproveitar o que o tema oferece e ainda acrescentar estilos e scripts ao formulário.

**Edição:** Após terminar de escrever, revisar esse artigo, já com ele pronto para publicação percebi que seria mais elegante, ao invés de editar o layout *page* para escolher entre os arquivos parciais, criar um novo layout chamado contato e declará-lo no `front-matter`do arquivo `.md`. Apesar de mais elegante essa solução demanda mais alterações no tema ficando, então, para outra oportunidade.

[hx]: https://hexo.io
[fp]: https://formspree.io
[tp]: https://github.com/LouisBarranqueiro/hexo-theme-tranquilpeak