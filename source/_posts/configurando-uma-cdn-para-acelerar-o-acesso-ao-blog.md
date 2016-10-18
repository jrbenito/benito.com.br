title: CDN - Colocando o Blog em velocidade dobra
date: 2016-06-15 02:00:41
updated: 2016-06-15 02:00:41
tags: 
   - AWS
keywords:
   - hexo
   - Amazon AWS
   - AWS
   - Cloudfront
   - Static website
   - CDN
---
Uma *Content Delivery Network* ou simplesmente CDN, é um serviço que provê cache do seu conteúdo armazenado em pontos estratégicos ao redor do globo. Esses pontos, estão, idealmente, mais próximos do cliente que solicita o conteúdo, portanto, a latência de acesso ao CDN é menor que até seu servidor. 
<!-- more -->

O principal objetivo da CDN é diminuir a latência aumentando a velocidade do site, porém as CDN adicionam ainda, disponibilidade e redundância que os provedores mais básicos (*e baratos*) não conseguem entregar.

## [AWS Cloudfront][cf]

Cloudfront é a CDN do Amazon Web Services e, como é costume do AWS, possui um [preços atrativos][cfp] e *free tier* generoso. Já que esse site é {% post_link hexo-aws-blog-s3-static-webhosting hospedado no AWS S3 %}, utilizar o Cloudfront é natural.{% blockquote %} O Github Pages já possui uma CDN servindo seus sites. Embora não haja muito controle sobre como seu conteúdo é armazenado (*cache*) e distribuído, o serviço é totalmente grátis para projetos não comerciais.{% endblockquote %}

### Criando uma distribuição

Para criar um nova distribuição acesse o [console][ccf] AWS e clique no serviço Cloudfront. Na tela que se abre clique no botão azul `Create Distribution`. Na tela seguinte será perguntado se você deseja criar uma CDN Web ou uma CDN RTMP, selecionamos o botão `Get Start` na sessão `Web`. A tela seguinte solicita as configurações da CDN, vou explicá-la por sessão.

#### Origin Settings

{% image fancybox right clear group:cdn origin-settings.png  85% "Configurações da Origem" %}

A Cloudfront não precisa ser usada em conjunto com AWS S3, mas sim com qualquer servidor web. Nessa sessão colocaremos as informações da origem, ou seja o seu servidor de conteúdo que geralmente é um servidor web ou no meu caso o bucket S3. 

No primeiro campo, `Origin Domain Name`, coloque o endereço do seu conteúdo, não o seu domínio pessoal mas sim o endereço servidor onde seu conteúdo está armazenado. Pode ser um nome ou um endereço IP disponibilizado pelo seu provedor. No caso de utilizar o AWS S3, o correto é colocar o [endereço (*endpoint*)][end] do bucket. 

{% blockquote %}O primeiro campo é traiçoeiro, ao clicar nele o console irá oferecer-lhe uma lista de seus buckets S3. {% hl_text danger %}Não utilize essa facilidade!{% endhl_text %}
Use o endpoint do seu bucket, dessa forma a CDN irá buscar o conteúdo via HTTP e não como objetos do S3 na rede interna da AWS. Isso evita erros nas URL não terminadas em "/". {% endblockquote %} 

O campo `Origin Path` pode deixar em branco a não ser que seu conteúdo esteja dentro de algum diretório, por exemplo http://www.exemplo.com/blog - nesse caso o path é `/blog`. 

O campo `Origin Id` é um apelido para a origem, um identificador. O ID é interessante quando a distribuição possui diversas origens e através do ID fica fácil diferenciá-las, como esse não é o caso vamos deixar em branco. E por fim, os campos `Origin Custom Headers` devem ficar em branco para os fins deste artigo. Detalhes sobre sua utilidade estão fora do escopo deste artigo.

#### Default Cache Behavior Settings

{% image fancybox right clear group:cdn default-settings.png  85% "Configurações de Cache" %}

Nesta sessão as opções padrão estão boas para a maioria dos blogs estáticos. Sugiro {% hl_text yellow %}apenas mudar para `yes` a opção{% endhl_text %} assinalada em vermelho. A Cloudfront é capaz de servir o conteúdo compactado com gzip, para clientes que aceitam essa opção - praticamente a totalidade dos navegadores atualmente - isso economiza banda e acelera ainda mais o download do seu conteúdo. No futuro essas configurações podem ser modificadas para atender as necessidades que surgirem, por exemplo o uso de HTTPS.

#### Distribution Settings

{% image fancybox right clear group:cdn distribution-settings.png  85% "Configurações da Distribuição" %}

{% pullquote right %}A opção padrão oferece melhor performance em todo o globo utilizando todos os servidores de borda disponíveis. É também a opção potencialmente mais cara.{% endpullquote %}O campo `Price Class` permite escolher algumas combinações de *Edge Locations* onde essa distribuição estará ativa. Os *Edge Locations* são as localidades dos servidores da CDN. No momento desta publicação [há servidores][edge] nos EUA, Europa, Asia e América do Sul. Entretanto as combinações disponíveis para configuração não incluem América do Sul. (não se preocupe, a América do Sul está incluída em todas combinações através da opção região USA).

{% pullquote left %}Após configurar a CDN você deverá alterar a configuração do seu DNS para apontar os CNAMES aqui definidos para o *endpoint* da CDN.{% endpullquote %}O campo `Alternate Domain Names` deve conter o nome de domínio registrado para servir o conteúdo.  No meu caso esse campo foi preenchido com `benito.com.br`, `www.benito.com.br` e  `blog.benito.com.br`. (no momento em que escrevo apenas os dois primeiros estão funcionando)

Nesse momento vamos manter os campos SSL como padrão e alterar o campo `Default Root Object` para `index.html`.(ou o nome do seu arquivo index padrão) 

Finalize a configuração clicando no botão `Create Distribution`.

{% image fancybox right clear group:cdn distribution.png  85% "Distribuição criada" %}

Anote o endereço destacado em vermelho na sua distribuição, vá até seu DNS server e configure o CNAME apropriado de seu domínio apontando para este endereço. No meu caso o endereço `www.benito.com.br` e `blog.benito.com.br` são CNAMES para essa distribuição, já o [domínio APEX] `benito.com.br` não pode ser do tipo CNAME e necessita tratamento especial, esta função depende de seu servidor DNS.

Perceba que sua distribuição está ativa e a do exemplo acima desativada, isso porque ela foi criada apenas para escrever esse artigo. Note ainda que ela está `in progress`, isso significa que os [servidores de borda][edge] ainda estão buscando seu conteúdo e preparando o cache. Pegue um café e relaxe, esse processo leva entre 15 e 30 minutos. Quando o processo terminar, o estado será `Deployed` e seu conteúdo estará sendo servido corretamente pela Cloudfront. 

### Endpoint S3 não aceita HTTPS

Esse é um ponto que me causou alguns problemas até eu descobrir o que estava errado. O *endpoint* do bucket S3 só pode ser acessado por HTTP e não por HTTPS. Já a distribuição Cloudfront pode servir tanto HTTP quanto HTTPS e, por padrão, repassa as requisições à origem no mesmo protocolo que recebe. Dessa forma se alguém acessar o site através do HTTPS, a CF irá requisitar o conteúdo no S3 através de HTTPS resultando em um erro. 

Para corrigir basta desabilitar o HTTPS na origem, essa opção não está disponível no momento em que se cria a distribuição. Para acessá-la, na tela da imagem anterior clique no ID da distribuição. Na tela que se abre clique na aba `Origin` e selecione a origem depois clique no botão `Edit`. Altere as opções conforme destaque na imagem abaixo e salve clicando em `Yes, edit`

{% image fancybox right clear group:cdn edit-origin.png  85% "Edição da origem" %}

## Conclusão

Utilizar um CDN para servir o conteúdo de um blog estático é uma boa estratégia já que todo o conteúdo pode ser armazenado em cache por algum período. Assim a CDN não só acelera o download do site mas também provê disponibilidade e redundância de servidores diminuindo o tráfego direto destinado ao seu provedor. O custo de uma CDN pode ser, inclusive com opções grátis no mercado, e os benefícios são muitos. A estrutura da Cloudfront é excelente para nós brasileiros pois possui servidores de borda no Rio de Janeiro e em São Paulo com latências baixíssimas para nossos leitores no Brasil.

Espero que esse artigo ajude você a por seu site em velocidade de dobra com a AWS Cloudfront. Vida longa e próspera!

[cf]: https://aws.amazon.com/cloudfront/ "Cloudfront page"
[cfp]: https://aws.amazon.com/cloudfront/pricing/ "Preço da Cloudfront"
[aws]: https://aws.amazon.com "Amazon Web Services"
[ccf]: https://console.aws.amazon.com/cloudfront/ "Console Cloudfront"
[end]: http://docs.aws.amazon.com/AmazonS3/latest/dev/VirtualHosting.html (VirtualHosting)
[edge]: https://aws.amazon.com/cloudfront/details/ "CF edge locations"
[apex]: https://blog.cloudflare.com/zone-apex-naked-domain-root-domain-cname-supp/ "naked domain"