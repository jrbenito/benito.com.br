title: Hexo+Aws=Blog! - Hexo para leigos (parte 1)
date: 2016-05-18 23:45:23
updated: 2016-06-01 22:24:30
tags: 
   - AWS
   - Hexo
   - Nodejs
keywords:
   - hexo
   - Amazon AWS
   - AWS
   - Blog
   - Static website
---
No {% post_link hexo-aws-blog primeiro artigo %} expliquei as motivações por trás da criação desse blog e porque optei por criar um site estático e armazená-lo utilizando os serviços do [Amazon Web Services][aws]. Nesta primeira parte da série vamos abordar o básico: [Hexo][hx]!
<!-- more -->
O Hexo é um *framework* para desenvolvimento de blogs estáticos com diversos [plugins][hplugin] que o tornam ainda mais poderoso. Ele é desenvolvido utilizando o [Node.js][node], um interpretador javascript desenvolvido com base no [*motor* javascript Chrome V8][chv8].

Se você já conhece e utiliza o Node.js, basta instalar o Hexo. Eu precisei instalar o Node.js em meu Ubuntu, e a maneira mais prática que encontrei para fazê-lo foi através do *nvm*; a forma também descrita na documentação do Hexo. No terminal do Ubuntu, como usuário normal (não root) fiz:

`$ wget -qO- https://raw.github.com/creationix/nvm/master/install.sh | sh`

E em seguida usei o `nvm` para instalar o Node.js.

`$ nvm install 4.4.3`

Muitos tutoriais na internet utilizam a versão 0.12 do Node.js com o Hexo, mas alguns plugins e módulos do próprio Node.js requerem a versão mais nova. Então preferi instalar a versão LTS, v4.4.3 enquanto escrevo esse artigo. Também poderia baixar o instalador no site do [Node.js][node]. Caso tenha usado o `nvm`, em novas sessões do terminal é importante ativar o Node.js rodando `nvm use 4.4.3`.

## Instalando o Hexo e iniciando o blog

Depois foi só instalar o [Hexo][hx]. No momento em que esse artigo é escrito a versão mais recente é a 3.2.0.

`$ npm install hexo-cli -g`

Para iniciar o blog

{% codeblock Iniciar o novo blog %}
    $ hexo init meuBlog
    $ cd meuBlog
    $ npm install
{% endcodeblock %}

O último comando é responsável por instalar os pacotes Node.js dos quais o hexo depende para gerar o blog. Para quem já trabalha com Node.js não é novidade, mas é importante saber que o diretório do blog é como uma espécie de sistema desenvolvido em Node.js. O Hexo e todas os pacotes dos quais eles dependente são instalados dentro do diretório do blog.

Para ver o blog rodando, o Hexo possui um mini servidor:

`$ hexo server`

Acesse o conteúdo apontando seu navegador para [http://localhost:4000](http://localhost:4000).

## Controlando seu blog com [Git][git]

Esse passo é opcional mas muito recomendado. Como alterações nas configurações, testes, novos artigos são operações freqüentes no blog, o versionamento do conteúdo é uma excelente maneira de manter registro dessas modificações e, de quebra, adicionar um pouco de proteção a desastres (sem dispensar o backup). Após inicializar o blog com Hexo, inicializei um repositório [Git][git]:

`$ git init`

Coloquei um arquivo `.gitignore` no repositório para instruir o git a ignorar arquivos que não devem ser rastreados.

{% codeblock .gitignore %}
    .DS_Store
    Thumbs.db
    db.json
    *.log
    node_modules/
    public/
    .deploy*/
    *~
{% endcodeblock %}

E adicionei os arquivos ao repositório:

{% codeblock "adicionar arquivos ao repositório" %}
    $ git add *
    $ git commit -m "Blog: estado inicial"
{% endcodeblock %}

A cada alteração importante eu gravo um *snapshot* no repositório com um novo *commit*. Dessa forma posso retroceder a qualquer momento no tempo e restaurar um estado funcional do site.

## Arquivos do site

Um site recém gerado com Hexo contém:

|              |    |
|--------------|----|
| _config.yml  | Configuração do blog e [plugins][hplugin] do Hexo |
| package.json | Lista de npm packages necessários para o blog |
| scaffolds    | Modelo dos layouts disponíveis (`draft`, `post`, `page`) |
| source       | Arquivos dos posts, páginas e conteúdo do site |
| themes       | Temas instalados, por padrão o Hexo traz o tema Landscape, esse site usa o [Tranquilpeak][tp] |

Veja a listagem deste blog.

{% codeblock lang:bash Hexo file structure %}
    drwxrwxr-x 6 jrbenito jrbenito 4096 Mai 19 00:43 .
    drwxrwxr-x 5 jrbenito jrbenito 4096 Mai 19 00:43 ..
    -rw-rw-r-- 1 jrbenito jrbenito 2203 Mai 19 00:43 _config.yml
    drwxrwxr-x 8 jrbenito jrbenito 4096 Mai 19 00:43 .git
    -rw-rw-r-- 1 jrbenito jrbenito   71 Mai 19 00:43 .gitignore
    -rw-rw-r-- 1 jrbenito jrbenito  727 Mai 19 00:43 package.json
    drwxrwxr-x 2 jrbenito jrbenito 4096 Mai 19 00:43 scaffolds
    drwxrwxr-x 7 jrbenito jrbenito 4096 Mai 19 00:43 source
    drwxrwxr-x 4 jrbenito jrbenito 4096 Mai 19 00:43 themes
    -rw-rw-r-- 1 jrbenito jrbenito 2590 Mai 19 00:43 .travis.yml
{% endcodeblock %}

Os arquivos `.git` e `.gitignore` são específicos dos repositório [git][git]; o `.travis·yml` também não pertence ao Hexo e sua função é assunto para outro post.

## Feito!

Pronto, agora é só personalizar o blog através das configurações e temas.

Dentre os geradores de sites que conheci, escolhi o hexo por sua simplicidade e por rodar em diversas plataformas sem problemas de compatibilidade possibilitando que eu edite esse blog em casa no Linux ou em uma máquina windows *on the go*. Continuando minha saga escreverei ainda sobre como hospedar o blog no [AWS S3][aws] e configurar uma CDN para acelerar o acesso ao site.

[aws]: //aws.amazon.com
[hx]: //hexo.io
[hplugin]: //hexo.io/plugins/
[node]: //nodejs.org/en/
[chv8]: //developers.google.com/v8/
[git]: //git-scm.com "Git"
[tp]: //github.com/LouisBarranqueiro/hexo-theme-tranquilpeak/
[jk]: //jekyllrb.com
[pc]: http://docs.getpelican.com/en/3.6.3/
[aws]: //aws.amazon.com