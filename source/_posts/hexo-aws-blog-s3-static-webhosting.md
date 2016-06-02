title: Hexo+Aws=Blog! - S3 static webhosting
date: 2016-06-01 22:45:58
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
Chegou a hora de publicar, o comando `hexo server` abre um mini servidor para o blog mas não é feito para rodar em produção. No {% post_link hexo-aws-blog primeiro artigo %} ficou claro que procuramos uma solução onde não precisemos nos preocupar com servidores ou coisas como distribuição de carga. Procura-se um *static web-hosting*.
<!-- more -->
## Github Pages
Um serviço gratuito e com boa qualidade é oferecido pelo [Github Pages][gh]. Sua configuração é muito simples e para quem já está acostumado com o Git o setup pode ser feito em questão de minutos. O *[plugin][hdg]* 'hexo-deployer-git` automatiza o processo de upload (o termo correto aqui é *commit*) tornando a manutenção do blog muito simples. Porém o Github pages não dá muito controle sobre como seu conteúdo é servido e sua CDN não permite invalidar o conteúdo do cache.

## Amazon S3
{% pullquote right %}
A nuvem AWS possui várias regiões, utilizar a região mais próxima do público alvo diminui a latência.
{% endpullquote %}
O [Amazon S3][s3] é um serviço de armazenamento de massa na nuvem. Ele trabalha com o conceito de *bucket* que pode ser entendido como um repositório ou um diretório raiz. O usuário pode ter quantos *buckets* quiser com nomes distintos e o [custo][s3c] por Gigabyte armazenado é muito baixo. Além do armazenamento, um bucket pode ser configurado para servir, de forma estática, o conteúdo armazenado. Ainda, a nuvem AWS possui várias regiões e uma delas fica em São Paulo, se o bucket for criado nessa região a latência para usuários brasileiros é bastante baixa quando comparada a serviços de *hosting* localizados no exterior. Se você ainda não se convenceu, somados os custos de armazenamento e transferência de dados, um blog com 100 mil acessos semanais não custa um BigMac.


Então mãos à obra?

### Criando o bucket
{% pullquote right %}
O nome do bucket não importa mas precisa ser único na região em que está sendo criado.
{% endpullquote %}
Abra o [console][s3con] do Amazon S3 para criar o bucket do site. Não reaproveite outro bucket pois iremos configurá-lo para servir o conteúdo através do protocolo HTTP, todo o conteúdo do bucket estará exposto na Internet. Clique no botão *Create Bucket* e escolha uma região para o bucket. Outro ponto importante é o nome do bucket, o domínio de nomes é compartilhado entre todos os usuários do AWS, então se eu criar um bucket chamado `balde` e outro usuário tentar criar um bucket com mesmo nome ele terá problemas. Para evitar esses conflitos sugiro podemos:

1. Prefixar o nome do bucket com seu nome de usuário Amazon (ideal para buckets privados que não servem conteúdo via HTTP). Exemplo `jsilva-balde`.
2. Prefixar o nome do bucket com o nome de domínio ou nome do domínio mais algum identificador (forma preferida para sites). Exemplos: `benito.com.br` ou `benito.com.br-site` e `benito.com.br-documentos`. Essa última forma ficar organizada se você tiver outros buckets para guardar informações privadas do site ou cliente.

Coloque o nome e clique no botão *Create* para finalizar.

{% blockquote %}Se pretende usar uma CDN para servir o site a região não importará{% endblockquote %}

{% image fancybox right clear group:bucket create-bucket.jpg  85% "Criar um Bucket" %}

### Configurando o Bucket
Agora clique no botão *Properties* direita e depois em *Static Website Hosting*, selecione *Enable website hosting*. Indique o nome do arquivo `index`, esse é o arquivo padrão que o S3 irá procurar em cada diretório. Para Hexo basta preencher com `index.html`. O Hexo não fornece uma página de erro (`404`), se você possui uma página de erro informe o nome no campo correspondente. Sempre que o S3 não encontrar algo ele irá apresentar essa página ao invés de uma mensagem de erro críptica que assustará seus leitores para sempre! 
{% image fancybox right clear group:bucket create-bucket.jpg  85% "Configurando o Bucket" %}

[gh]: https://pages.github.com
[hdg]: https://hexo.io/docs/deployment.html
[s3]: https://aws.amazon.com/s3/
[s3c]: https://aws.amazon.com/s3/pricing/
[s3con]: https://console.aws.amazon.com/s3/home