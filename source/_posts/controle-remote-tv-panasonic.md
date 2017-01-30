---
date: '2017-01-30 00:07 -0200'
updated: '2017-01-31 11:10 -0200'
comments: true
published: true
title: Receptor IR TV Panasonic com defeito
tags:
   - eletrônica
keywords:
   - panasonic
   - controle remoto
   - infravermelho
   - PCB
---

**Importante:** _O autor não se responsabiliza por consequências causadas em decorrência deste artigo. Só mexa em aparelhos eletro-eletrônicos se for qualificado para tal._

## O problema ##

Possuo uma TV Plasma da Panasonic, o modelo é TC-P50UT20B que, ao que parece, é uma tropicalização da TX-50VT20B. Eu gosto de TVs de Plasma graças à profundidade do preto que estas telas oferecem, mas confesso que gostava mais da minha antiga TX-P50V20B (a versão não 3D e não - muito -tropicalizada). Bom mas isso é história para outro artigo.

Da noite para o dia essa TV parou de ligar pelo controle remoto. Claro que troquei as pilhas do controle remoto sem sucesso. Também testei com um controle universal sem o menor sucesso. Para finalizar o diagnóstico eu apontei o controle remoto para a câmera do celular e é possível ver o LED IR (infravermelho) piscar. Se não é o controle remoto só pode ser a TV...
<!-- more -->

### Aprendendo com a experiência (ruim) de outros ###

Seguindo o caminho padrão recorri ao [oráculo](https://www.google.com.br "Google") e encontrei alguns relatos de pessoas com problemas similares em modelos de outras marcas. Os relatos eram sempre de que a TV parava de responder a qualquer controle remoto mas que funcionava perfeitamente ao ser comandada pelos botões no painel ou via algum aplicativo de celular (se a mesma for uma SmartTV e possuir esse tipo de aplicativo). Esse é exatamente o sintoma que a minha Pana vinha apresentando.


### Minha experiência (ruim) com assistências técnicas ###

Com todas as informações em mãos eu abri um chamado na Panasonic perguntando se haveria algum procedimento para fazer o _reset_ da TV uma vez que o procedimento descrito no manual faz uso do controle remoto - justamente o que não está funcionando. Relatei em meu chamado que já havia testado o controle remoto, trocado pilhas e usado um outro controle remoto e que esse não era o real motivo. No dia seguinte eu recebi uma reposta da Panasonic aconselhando-me a verificar as pilhas do controle remoto e testá-lo com a câmera do celular... Mas não foi exatamente isso que escrevi no meu chamado? Ao que parece existe uma doença epidêmica que acomete canais de suporte técnico; tal doença apresenta sintomas como ignorar o que é escrito pelo consumidor e responde-lo com respostas genéricas de algum manual. Em casos mais graves pode forçar o suporte a não responder. Contente-se se seu suporte responder mesmo que seja repetindo exatamente o que você descreveu.

Liguei em três assistências técnicas autorizadas, a primeira disse que o modelo era velho e que não teria peça condenando minha TV ao descarte. A segunda assistência ouviu todo meu relato e negou-me falar diretamente com o técnico, disse que o procedimento era eu levar a TV até eles e em até 7 dias eles me passavam um diagnóstico e orçamento. Insisti dizendo que a assistência ficava a 35 km da minha cidade e que eu gostaria de falar com um técnico para saber se havia possibilidade de eu levar apenas a peça defeituosa ou ele simplesmente encomendar a placa de IR e eu levar a TV só para trocar. Nada! A moça que me atendeu parecia estar falando com um E.T. que apareceu falando coisas que ela não entendia e queria a todo custo burlar o processo que ela seguia de forma tão correta. A terceira assistência foi quase como a segunda, mas a moça não pensou que eu fosse um "quebra protocolo" e, percebendo que eu entendia um pouco daquilo que falava, disse: "Olha, essas TVs não têm mais peça de reposição no mercado. O que fazemos é mandar a placa para um __laboratório__ e eles verificam se há como trocar os componentes". A palavra _laboratório_ foi o que me chamou a atenção para o fato de que eu mesmo poderia verificar o que estava errado na placa de IR. Afinal de contas ali não tem nenhum CI elaborado, mas sim componentes simples como resistores, capacitores e sensor de IR (óbvio ddddduuuuhhhhh!).


## Desmontando a Pana ##

Desmontar a TV não foi complicado, por sorte eu tive auxílio de uma parafusadeira pois tirar os 20 parafusos que prendem a tampa traseira ao corpo da TV seria um trabalho ingrato de se fazer na unha. Durante a retirada da tampa me deparei com um módulo estranho, olhado as inscrições no mesmo descobri tratar-se de um módulo _Bluetooth_. Porque diabos essa TV tem um módulo _Bluetooh_ que não aparece em menu nenhum, muito menos em seu manual, permanece um mistério ainda por ser desvendado.{% image nocaption fancybox fig-50 tv-aberta.jpg tv-aberta-375.jpg "TV aberta ocupando meu sofá" %} O fato do módulo não ter certificação da Anatel causa-me a impressão de que é uma das funcionalidades capadas durante a tropicalização do modelo - mas porque colocar o módulo lá se ele não está funcionado? Bom, deixa isso para lá, a TV atende minhas necessidades sem que eu saiba para que isso está ali.

Retirados a tampa traseira e o misterioso módulo _Bluetooth_, a placa IR está a um parafuso de sair. A mesma placa é compartilhada por outras duas funções: o LED de ligado/espera e o sensor de iluminação usado pela TV para calcular o brilho aplicado ao painel quando o _ECO Mode_ está ativado. A placa possui a identificação TNPA5602, que usei para pesquisar na Internet e descobrir que a placa toda custa US$ 10,00 no [eBay](https://ebay.com "eBay") mas que ninguém no Brasil tem a essa placa para vender. De fato a participação de mercado da Panasonic no Brasil não é algo que salte aos olhos e quando falamos em TVs de plasma a base instalada é ainda menor. Se não tem usuário não tem mercado para peças certo?


### Desvendando o circuito ###

Sabendo que existe placa semelhante para venda, eu fiquei mais tranquilo de tentar arrumá-la e, em caso de desastre, posso encomendar outra. Mas para mexer na placa eu preciso entender o circuito. Meu amigo Alexandre do [Tabajara Labs](www.tabalabs.com.br/ "Tabajara") pegou uma foto da placa e desvendou parte do circuito para mim. Mas torturando um pouco mais o Google, o Pedro - outro amigo, conseguiu encontrar o manual de serviço de uma TV que compartilha a mesma placa. O circuito está abaixo com a parte do infravermelho em destaque.

<p></p>

{% image fancybox center clear group:pcb esquematico.jpg esquematico-375.jpg "Esquemático: destaque para o circuito do receptor infravermelho" %}


### Procurando o culpado ###

Utilizando um multímetro e com a placa IR conectada na TV eu comecei a medir as tensões. Primeiro a entrada Vcc, provavelmente normal pois o LED da TV brilha normalmente. Como esperado, o Vcc apresentava tensão de 3.3V mas, no pino Vcc do sensor de IR (círculo azul nas imagens) havia aproximadamente 0,72V. Isso indica que algo, o sensor ou algum componente vizinho, está derrubando a tensão Vcc. Pensei que o sensor poderia estar em curto ou algo parecido, mas esses sensores são bastante robustos e pelo circuito ele não está condenado a nenhum trabalho forçado. Foi aí que reparei nos capacitores de desacoplamento que ficam próximos ao sensor (destaques amarelo e vermelho no verso da placa). Meu grande amigo Alex sugeriu que um deles ou ambos poderiam estar em curto circuito devido a fadiga.

<p></p>

{% image fancybox fig-50 group:pcb pcb-frente.jpg pcb-frente-375.jpg "Frente PCB - destaques para Vcc sensor e R2542. O Sr. Foco não pode comparecer" %}
{% image fancybox fig-50 clear group:pcb pcb-verso.jpg pcb-verso-375.jpg "Verso PCB - destaques para R2517, C2512 e C2521" %}

Para testar essa possibilidade eu desliguei a TV e retirei a placa depois descarreguei os capacitores para evitar danos ao multímetro. Colocando o multímetro na função ohmímetro e medindo os terminais dos capacitores esse deve apresentar resistência zero Ohm e ir aumentando, preferencialmente até indicar resistência infinita (acima da escala de medição). Porém eu obtive a leitura de aproximadamente 7,5O Ohms, isso significa que um ou ambos capacitores está com problemas, esse valor de resistência é muito baixo. Aliado ao resistor (R2517) de 47 Ohms (destaque marrom) entre Vcc da alimentação e o pino Vcc do sensor, forma-se um divisor resistivo entregando uma tensão mais baixa para o sensor. Calculando a tensão resultante desse divisor para Ventrada=3,3V, R1=47 e R2=7,5 temos Vsaída=0,45V, mais baixa um pouco que aquela que eu efetivamente verifiquei com o circuito ligado, talvez porque a resistência dos capacitores aumente um pouco quando eles estão energizados ou por erro de medida do meu multímetro. Curiosidade: o valor de R2 para que a saída seja de 0,72V teria que ser de aproximadamente 13 Ohms.


### Reparando a placa ###

Se os culpados são os capacitores, qual deles? Ambos? Um palpite baseado na experiência diz que o capacitor de menor tensão (6,3V) tem mais chances de sofrer danos nesse circuito. Utilizando um ferro de solda eu retirei o capacitor C2512 (circulado em amarelo) e repeti a medida de resistência nele fora do circuito. Obtive aproximados 6 Ohms, de fato este capacitor estava danificado. Medi também o capacitor que ficou no circuito e obtive vários kilo-Ohms na leitura. Voltando a teoria do divisor de resistivo, com R1=47 e R2 agora valendo quase 1 Mega-Ohm, teríamos praticamente os 3,3V no pino Vcc do sensor. Testei a placa sem o capacitor de volta na TV. O circuito apresentou 3.3V no pino Vcc do sensor, apontei o controle remoto e este funcionou perfeitamente; a TV estava de volta à ativa.

Montei a TV sem o capacitor, como sua função é apenas de desacoplamento, sua falta não irá interferir (muito) no funcionamento do sensor IR. Não queria ficar sem TV por mais tempo e já estava de saco cheio de ter meu sofá tomado pela grande tela de 50" que inviabilizava qualquer um de sentar ali. E nem vamos falar no que poderia acontecer se alguém acidentalmente derrubasse o potinho de parafusos que estava ao lado, no braço do sofá. Quando eu precisar comprar uns componentes eu aproveito e coloco esse capacitor na lista.


## Conclusão ##

Apesar do controle remoto não ser imprescindível ao funcionamento da TV, muitas configurações ficam impossíveis. O problema mostrou-se muito mais simples do que o prognóstico dado pelas assistências técnicas. Como em quase todos os problemas da vida, a fase de preparação e pesquisa tomou mais tempo que a execução; eu gastei algumas horas vasculhando a Internet por manuais e informações dessa TV, mais algumas horas discutindo o circuito com amigos e pouco mais de 2 minutos para retirar a peça problemática e testar o circuito. E como toda experiência na vida, valeu a pena cada informação absorvida no processo. Para mim o mais importante nesse tipo de situação é escapar da armadilha da obsolescência programada que nos impele a comprar produtos novos e jogar fora produtos que poderiam ter vida útil estendida.

