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
O [Amazon S3][s3] é um serviço de armazenamento de massa na nuvem. Ele trabalha com o conceito de *bucket* que pode ser entendido como um repositório ou um diretório raiz. O usuário pode ter quantos *buckets* quiser com nomes distintos e o [custo][s3c] por Gigabyte armazenado é muito baixo. Além do armazenamento, um bucket pode ser configurado para servir, de forma estática, o conteúdo armazenado. Ainda, a nuvem AWS possui várias regiões e uma delas fica em São Paulo, se o bucket for criado nessa região a latência para usuários brasileiros é bastante baixa quando comparada a serviços de *hosting* localizados no exterior. Se você ainda não se convenceu, somados os custos de armazenamento e transferência de dados, um blog com 100 mil acessos semanais não custa um BigMac.

Então mãos à obra?

### Configurando o bucket



[gh]: https://pages.github.com
[hdg]: https://hexo.io/docs/deployment.html
[s3]: https://aws.amazon.com/s3/
[s3c]: https://aws.amazon.com/s3/pricing/