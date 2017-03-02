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
Blogs e sites gerados através de programas como [Hexo](http://hexo.io) ou [Jekyll](https://jekyllrb.com/) trazem uma simplicidade enorme para o servidor e uma mudança de paradigma no que tange a gerência do conteúdo. Porém a simplicidade no servidor vem a um custo: a preparação do conteúdo! É necessário escrever em um editor, salvar o arquivo e "compilar" o site com o gerador e só depois subir no servidor. Será que há como automatizar isso?
<!-- more -->

## Inspiração

O serviço [Github Pages](https://pages.github.com/) é muito simples e interessante. Fantástico eu diria! Ao mesmo tempo que é simples, permite usar ferramentas mais complexas como o gerador de sites [Jekyll](https://jekyllrb.com/) que, no caso do Github Pages, a cada _commit_ no repositório do seu projeto, gera as páginas estáticas automaticamente. Isso resolve o problema da geração sem a necessidade de instalações locais.

Infelizmente o serviço do Github limita-se a fornecer o Jekyll, como rodar outros geradores ou mesmo versões customizadas do Jekyll? [Travis-ci](https://travis-ci.org)!!!

## Integração contínua

O Travis é um serviço de integração contínua. No mundo do desenvolvimento de software isso é como um servidor de compilação que, a cada integração de código feita pelos desenvolvedores (_commit_), executa uma compilação e, possivelmente, testes automáticos. Para entender melhor leia os artigos ["Integração contínua: uma introdução ao assunto"](http://www.devmedia.com.br/integracao-continua-uma-introducao-ao-assunto/28002) e ["O que significa integração contínua?"](https://aws.amazon.com/pt/devops/continuous-integration/).[^1]

Na verdade, o Travis é uma máquina virtual que roda uma configuração de comandos para compilar e testar o código. Quase qualquer comando do Linux (SO nativo do Travis) pode ser executado sobre o código. Rodar o Hexo ou qualquer outro gerador é possível.

## Versionamento

Para que o Travis enxergue o projeto, este precisa estar  versionado em um repositório no Github. Usando o [repositório deste blog](https://github.com/jrbenito/benito.com.br) como exemplo, as informações ficam no _branch_ [`development`](https://github.com/jrbenito/benito.com.br/tree/development). Para mais detalhes leia o {% post_link hexo-aws-blog-hexo-para-leigos-parte-1 "post" %}.

## Configurando o Travis

Ao criar uma conta no [Travis-ci](https://travis-ci.org) utilizando as credenciais do Github e autorizá-lo, ele instalará _hooks_[^2] nos repositórios de cada projeto ativado.

Pode-se configurar o Travis através de um arquivo de versionado no repositório do próprio projeto. O arquivo deve ser nomeado [`.travis.yml`](https://github.com/jrbenito/benito.com.br/blob/development/.travis.yml) e, como a extensão sugere, ele é escrito no formato [YAML](http://www.yaml.org/).

```
language: node_js
node_js:
  - "4.4.3"
```
As primeiras linhas definem a linguagem e a versão do compilador/interpretador utilizado. Depois, há a lista de _branches_ que serão compilados (`#whitelist`) e a lista de _branches_ cujos os _commits_ serão ignorados:
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

Na sessão `before_install` são instalados o Hexo e suas dependências, exatamente como se estivesse preparando uma máquina linux nova para rodar o Hexo: 

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

Caso o comando `hexo generate` termine em sucesso, o Hexo rodará a sessão `before_script`. No caso deste blog, o git faz o clone do _branch_ `conteudo`, esse passo serve apenas para manter um histórico do site gerado e é completamente opcional. Um detalhe importante desta configuração está na sessão `script`:

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

Na linha 4 do trecho acima, o comando `sed` substituirá a URL do repositório no arquivo de configuração do Hexo. Mais precisamente, esse comando está trocando o protocolo de acesso `SSH` por `HTTPS` e acrescentando um _token_ de autorização para poder escrever no repositório no github. Mas de onde vem a variável `GH_TOKEN`?[^3] O Travis dispões de dois mecanismos para configuração de variáveis de ambiente. Uma através do site, na configuração do repositório e a segunda através da criptografia da variável e seu conteúdo no arquivo `.travis.yml`.[^5]

Neste exemplo foi utilizado o [método da criptografia](https://docs.travis-ci.com/user/environment-variables/).[^4]

```
env:
  global:
  - secure: O5f2zGaXraEVUOIk[...]
  - secure: bsmjzMqApTjofgAc[...] 
  - secure: A84t9ASnL11WFrqL[...] 
```

### Habilitando o repositório no Travis.

Falta pouco! Com a configuração versionada no repositório é necessário avisar ao Travis que ele deve vigiar tal projeto. No site do Travis procure pelo sinal `+` no canto superior esquerdo da tela, esse é o botão _"Add New Repository"_.

{% image fancybox group:travis travis-settings.jpg "Configurações de repositório no Travis" %}

Nas configurações do repositório (_more options -> settings_), habilite _Build only if .travis.yml is present_ e _Build pushes_ e mantenha desabilitado _Build pull requests_ já que não desejamos que contribuições de qualquer pessoa gerem o site. Nesta mesma página é possível especificar variáveis de ambiente se necessário.

## Conclusão

Pronto! Todo _commit_ no repositório do blog irá disparar o Travis e gerar o site. Utilizando o _Grunt_ o conteúdo produzido é atualizado no servidor.

[^1]: Há muitos outros artigos mais completos sobre o assunto, a ideia é apenas referenciar o conceito não desviando o foco.
[^2]: [O que são hooks?](https://git-scm.com/book/gr/v2/Customizing-Git-Git-Hooks)
[^3]: Os repositório grátis são também **públicos**, é **muito importante** não versionar dados sensíveis como credenciais de acesso, tokens, etc.
[^4]: O conteúdo das três variáveis foi cortado afim de poupar espaço.
[^5]: O comando `hexo deploy` escreve a URL do github (e seu _token_) nos registros de compilação do Travis. Para evitar isso é só usar a opção `--silent`.