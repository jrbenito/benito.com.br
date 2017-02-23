---
title: "Automatizando a geração do blog"
date: 2017-02-23 19:00:00
updated: 2017-02-23 19:00:00
tags:
    - Hexo
    - nodejs
keywords:
    - travis-ci
    - hexojs
    - integração continua
    - continuos integration
---
A minha opção por gerar esse blog estaticamente através do gerador [Hexo](http://hexo.io), teve como principal motivação a simplicidade do lado do servidor. Nada de instalações complexas do Apache, PHP, Wordpress e servidores rodando 24 horas por dia. Qualquer provedor capaz de servir HTML serve. Essa facilidade não vem de graça, é preciso, além de escrever o conteúdo, "compilá-lo" através do Hexo. Descomplicamos o servidor mas complicamos a geração do conteúdo. Será?
<!-- more -->

## Inspiração

O serviço [Github Pages](https://pages.github.com/) é muito simples e interessante. Fantástico eu diria! Ao mesmo tempo que é simples, permite usar ferramentas mais complexas como o gerador de sites [Jekyll](https://jekyllrb.com/) que, no caso do Github Pages, a cada _commit_ no repositório do seu projeto, gera as páginas estáticas automaticamente. Isso resolve o problema da geração sem a necessidade de instalações locais.

Se eu pudesse ter um serviço que rodasse o Hexo a cada _commit_ no meu conteúdo igual ao Github faz com Jekyll, meu problema estaria resolvido, basta um _commit_ e a geração do site seria automática. Mas como? [Travis-ci](https://travis-ci.org)!!!

## Integração contínua

O Travis é um serviço de integração contínua. No mundo do desenvolvimento de software isso é como um servidor de compilação que, a cada integração de código feita pelos desenvolvedores (_commit_), executa uma compilação e, possivelmente, testes automáticos. Para entender melhor leia os artigos ["Integração contínua: uma introdução ao assunto"](http://www.devmedia.com.br/integracao-continua-uma-introducao-ao-assunto/28002) e ["O que significa integração contínua?"](https://aws.amazon.com/pt/devops/continuous-integration/).[^1]

Na verdade, se olharmos bem, o Travis sobe uma máquina Linux e roda um script definido no seu projeto para compilar e testar seu código. Então podemos fazê-lo rodar o Hexo? Claro!


## Versionando o blog

Todo projeto precisa ser versionado, não há outra maneira. O [git](https://git-scm.com/) é super popular, grátis, poderoso e fácil de usar. Este blog é versionado com git e seu código fonte armazenado em um repositório também grátis[^3] no [github](https://github.com/jrbenito/benito.com.br).

O {% post_link hhexo-aws-blog-hexo-para-leigos-parte-1  esquema de versionamento é simples %}, basta fazer um repositório git com toda a estrutura de diretórios criada pelo Hexo na inicialização do site. Neste blog eu optei por manter o _branch_ `master` apenas com a descrição do projeto (arquivo `Readme.md`) e criar um _branch_ [`development`](https://github.com/jrbenito/benito.com.br/tree/development) para a versão de produção.

## Configurando o Travis

Primeira coisa a fazer é criar uma conta no [Travis-ci](https://travis-ci.org) utilizando as credenciais do Github para autorizá-lo no GH pois, ele precisa instalar _hooks_[^2] nos repositórios de cada projeto a ser compilado.

É necessário instruir o Travis sobre o que fazer no seu projeto. Isso é feito através de um arquivo de configuração versionado no repositório do projeto. O nome desse arquivo deve ser [`.travis.yml`](https://github.com/jrbenito/benito.com.br/blob/development/.travis.yml) e, como a extensão sugere, ele é escrito na linguagem YAML. Vamos entender o arquivo.
```
language: node_js
node_js:
  - "4.4.3"
```
A primeira parte diz ao Travis que este projeto é escrito em [Nodejs](https://nodejs.org/) e a versão utilizada. Seguindo essa parte, há a lista de _branches_ que serão compilados (`#whitelist`) e a lista de _branches_ cujos os _commits_ serão ignorados:
```
# whitelist
branches:
  only:
      - development
      - test-site-development
# blacklist
  except:
      - master
      - conteudo
```

Para agilizar a compilação e também para poupar espaço no ambiente do travis, o git é configurado para clonar apenas o último _commit_. Na sessão `before_install` são instalados o Hexo e suas dependências, exatamente como se estivesse preparando uma máquina nova para rodar o Hexo. Pode parecer estranho instalar na sessão _"before_install"_, o motivo para isso é que a geração do site pelo Hexo precisa acontecer na sessão de _install_:

```
git:
  depth: 1
before_install:
- npm install -g hexo-cli
- npm install -g grunt-cli
- npm install -g bower
- npm install
- cd themes/tranquilpeak/
- npm install
- bower install
- grunt buildProd
- cd ../../
install:
- hexo generate
```

Se a "compilação" do site terminar em sucesso, o Hexo pode ainda rodar um script, geralmente essa sessão é utilizada para rodar testes ou atuar sobre os dados. No caso deste blog, na sessão `before_script`, o git faz o clone do _branch_ `conteudo`. Esse passo serve apenas para manter um histórico do site gerado e é completamente opcional. Porém serve de exemplo para uma parte importante da configuração:

```
before_script:
- git config --global user.name 'Josenivaldo Benito Jr'
- git config --global user.email 'jrbenito@benito.qsl.br'
- sed -i'' "s~git@github.com:jrbenito/benito.com.br.git~https://${GH_TOKEN}:x-oauth-basic@github.com/jrbenito/benito.com.br.git~" _config.yml
- git clone https://github.com/jrbenito/benito.com.br.git .deploy_git -b conteudo
script:
- grunt s3-prod-deploy
- hexo deploy --silent
after_success:
- grunt sns
```

Perceba que a linha 4 do trecho acima utiliza o comando `sed` para substituir a URL do repositório no arquivo de configuração do Hexo. Mais precisamente, esse comando está trocando o acesso de `SSH` para `HTTPS` e acrescentando um _token_ de autorização para poder escrever no repositório no github. Mas de onde vem a variável `GH_TOKEN`? Claro que não se deve versionar informações sensíveis como credenciais de acesso, chaves criptográficas e, pensando nisso, o Travis dispões de mecanismos para configuração de variáveis de ambiente que não precisam estar no arquivo `.travis.yml`. É importante que o comando `hexo deploy` não revele o _token_ nos logs do Travis. Para isso é só usar a opção `--silent`.

Porém, especificar essas variáveis no site do travis inviabiliza o teste local na máquina de desenvolvimento. Para contornar essa situação é possível [criptografar as variáveis](https://docs.travis-ci.com/user/environment-variables/) e armazená-las na configuração[^4].

```
env:
  global:
  - secure: O5f2zGaXraEVUOIk[...]
  - secure: bsmjzMqApTjofgAc[...] 
  - secure: A84t9ASnL11WFrqL[...] 
```

### Habilitando o repositório no Travis.

Falta pouco! Com a configuração versionado no repositório é necessário avisar ao Travis que ele deve vigiar tal projeto. No site do Travis procure pelo sinal `+` no canto superior esquerdo da tela, esse é o botão _"Add New Repository"_.

{% image fig-33 group:group-name travis-settings.jpg "Configurações de repositório no Travis" %}

Nas configurações do repositório (_more options -> settings_), habilite _Build only if .travis.yml is present_ e _Build pushes_ e mantenha desabilitado _Build pull requests_ já que não desejamos que contribuições de qualquer pessoa gerem o site. Nesta mesma página é possível especificar variáveis de ambiente se necessário.

## Conclusão

Pronto! Todo _commit_ no repositório do blog irá disparar uma geração do site pelo Hexo e, graças aos _plugins_ de entrega e tarefas _Grunt_, o conteúdo produzido é atualizado no servidor.

[^1]: Certamente há muitos outros artigos até melhores no assunto, a ideia é apenas referenciar o conceito já que este não é o foco deste artigo.
[^2]: [O que são hooks?](https://git-scm.com/book/gr/v2/Customizing-Git-Git-Hooks)
[^3]: Os repositório grátis são também **públicos**, é **muito importante** não versionar dados sensíveis como credenciais de acesso, tokens, etc.
[^4]: O conteúdo foi cortado para as três variáveis afim de poupar espaço. O conteúdo completo está no repositório do blog.