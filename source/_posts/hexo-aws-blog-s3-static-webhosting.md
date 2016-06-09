title: Hexo+Aws=Blog! - S3 static webhosting
date: 2016-06-08 23:50:58
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

{% image fancybox right clear group:bucket create-bucket.png  85% "Criar um Bucket" %}

### Configurando o Bucket
Agora clique no botão *Properties* direita e depois em *Static Website Hosting*, selecione *Enable website hosting*. Indique o nome do arquivo `index`, esse é o arquivo padrão que o S3 irá procurar em cada diretório. Para Hexo basta preencher com `index.html`. O Hexo não fornece uma página de erro (`404`), se você possui uma página de erro informe o nome no campo correspondente. Sempre que o S3 não encontrar algo ele irá apresentar essa página ao invés de uma mensagem de erro críptica que assustará seus leitores para sempre!

{% image fancybox right clear group:bucket config-bucket.png  85% "Configurando o Bucket" %}

Anote o *Endpoint* mostrado nessa tela, ele é o endereço de acesso do bucket na web.

O próximo passo é editar as permissões do bucket permitindo acesso público a esse bucket. Ainda nas propriedades, clique no item *Permissions* e depois no botão *Edit bucket policy*. No editor que abrirá coloque a política abaixo.

{% codeblock %}
{
	"Version": "2008-10-17",
	"Statement": [
		{
			"Sid": "Allow Public Access to All Objects",
			"Effect": "Allow",
			"Principal": {
				"AWS": "*"
			},
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::benito.com.br/*"
		}
	]
}
{% endcodeblock %}

Altere a linha para refletir o nome do bucket, salve e feche o edito. Está garantido o acesso público de leitura a todos os objetos do bucket.

Vamos aproveitar o embalo e adicionar a configuração de CORS (*Cross-Origin Resource Sharing*). Esse passo é importante para garantir que outros sites possam acessar seu conteúdo, por exemplo, uma CDN servindo o conteúdo do seu S3 ou um outro site referenciando um script Javascript servido por este bucket/site. Para isso clique no botão *Add CORS configuration*, ao lado do botão usado no passo anterior. No editor que se abrirá coloque a configuração abaixo.

{% codeblock %}
<CORSConfiguration>
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
        <AllowedHeader>Authorization</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
{% endcodeblock %}

Essa configuração é bastante permissiva e não vamos detalhar seu funcionamento agora. No futuro se pode alterar essa política conforme a necessidade do site. A Amazon provê uma vasta documentação a respeito.

## Upload

Para subir suas páginas HTML no bucket, utilize o método que mais lhe convir. Nesse momento sugiro o próprio S3 Console; clique no botão azul *upload*, agora arraste o arquivos da pasta `public` do seu Hexo para área cinza demarcada no S3 Console. Espere tudo o upload terminar e teste acessando o *endpoint* do seu bucket digitando `http://<endpoint>` no seu navegador.

Depois instalaremos um [plugin][plg] para fazer o upload diretamente do Hexo.

# Conclusão

Pronto! Apesar do post extenso, executar os passos descritos não levará mais que 15 minutos e seu site já está no ar. Não esqueça de verificar o valor do armazenamento S3 na região que você escolheu e simular o custo mensal na [calculadora AWS][awscalc]. Vale lembrar que Amazon oferece um *free tier* generoso durante um ano para novos clientes.

Ah! Quase esqueço, se você tem um domínio e deseja servir o blog deste domínio precisa apontar um `CNAME` para o *endpoint* da amazon. Explicarei com mais detalhes quando configurarmos a CDN. Até lá.

[gh]: https://pages.github.com
[hdg]: https://hexo.io/docs/deployment.html
[s3]: https://aws.amazon.com/s3/
[s3c]: https://aws.amazon.com/s3/pricing/
[s3con]: https://console.aws.amazon.com/s3/home
[plg]: https://www.npmjs.com/package/hexo-deployer-s3-cloudfront "hexo-deployer-s3-cloudfront"
[awscalc]: https://calculator.s3.amazonaws.com/index.html "calculadora de custos AWS"