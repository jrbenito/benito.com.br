---
title: "Hexo + AWS = Blog!"
data: 2016-05-06 20:00:00
tags:
   - AWS
   - Hexo
keywords:
   - hexo
   - Amazon AWS
   - AWS
   - Blog
   - Static website
---

# Introdução

Recentemente meu irmão iniciou um [projeto](http://counsellor.life) para sua esposa; um site com sua apresentação profissional e um fomulário de contato para que seus clientes pudessem encontrá-la. Ele já tinha um esboço do trabalho e estava hospedando junto ao site de um amigo apenas para teste. Começamos a conversar sobre qual domínio registrar, qual hospedagem contratar, qual tamanho da demanda e claro: preço! 

Já há algum tempo que eu venho maturando a ideia de iniciar um blog com o objetivo de documentar meus projetos pessoais, compartilhar informação e manter organizado aquele conhecimento resultado de horas na Internet tentando resolver algum problema (geralmente simples). A discussão sobre o projeto para minha cunhada foi a faísca para que eu mergulhasse em uma pesquisa sobre sites, hospedagem, custos, tecnologias e acabasse por escrever esse primeiro post.
<!-- more -->

# Estático vs. Dinâmico

O modelo mais comum de website contém uma mistura de páginas com conteúdo estático e páginas de conteúdo dinâmico que se alteram de acordo com a interação entre o usuário e o sistema. Por exemplo, uma oficina mecânica teria em seu site páginas de informações estáticas como endereço, serviços prestados, fotos do local e um sistema para confecção de orçamentos via internet que gera conteúdo dinamicamente.

Sistemas web necessitam que seu código fonte seja executado no servidor, também costumam depender de bancos de dados e essa estrutura pode ser bem grande e depender de vários computadores para funcionar. Um bom provedor de hospedagem oferece pacotes que alocam recursos computacionais de acordo com a necessidade dos usuários.

Já o conteúdo estático precisa apenas ser transmitido de um servidor para o cliente, geralmente um navegador web. Esse processo não envolve grande poder computacional e ainda há a possibilidade de cache diminuindo o tráfego de dados sendo possível a utilização de pacotes de serviços mais baratos e com menos recursos computacionais.

Para o projeto de minha cunhada, meu irmão e eu chegamos a conclusão que um conjunto de páginas estáticas em HTML5, CSS e Javascript seria suficiente. 

# Hospedagem

Na pesquisa por hospedagem eu encontrei nos serviços [AWS da Amazon][aws] uma alternativa muito interessante. O [Amazon Web Services] é o nome comercial de um dos maiores serviços de computação em nuvem do planeta. Eles comercializam serviços com preços atrativos e faixas de consumo que se adaptam ao tipo do usuário.

O serviço [S3][s3] é uma espécie de disco rígido virtual onde se pode armazenar quantidades absurdas de dados com garantias de durabilidade, versionamento e preços atrativos. O [S3][s3] é capaz de servir o conteúdo armazenado em forma de site estático, o custo por GB é baixo, ele oferece um _free tier_ para novos clientes que é suficiente para acomodar sem custos o projeto de minha cunhada nos primeiros meses. Problema resolvido.

Também através dessas pesquisas eu conheci o [Hexo][hx] um gerador de sites estáticos escrito em [Node.js][ns], cheio de plugins e de fácil automação. Perfeito para iniciar meu blog e hospedá-lo no [AWS][aws].

# Nasce mais um blog

Inspirado pela pesquisa e satisfazendo um desejo antigo estou iniciando esse blog utilizando:
+ [Amazon AWS][aws] como _backend_
+ [Hexo][hs] para gerar o site
+ [Draftin][draf] para escrever esse post

Além de um nome pouco criativo para o blog.

Nos próximos artigos eu farei um passo à passo de como coloquei esse blog no ar, a configuração do Hexo, Node.js, dos plugins e dos serviços AWS. Fique ligado.


[hx]: http://hexo.io/ "Hexo.io"
[ns]: http://nodejs.org "NodeJs.org"
[aws]: https://aws.amazon.com "Amazon Web Services"
[s3]: https://aws.amazon.com/s3 "Amazon Simple Storage  Service"
[draf]: https://draftin.com "WRITE BETTER WITH DRAFT"

