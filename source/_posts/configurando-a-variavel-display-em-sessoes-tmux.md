---
title: "Variável DISPLAY em sessões tmux"
date: 2017-02-10 11:40:00
updated: 2017-02-10 12:42:00
tags:
    - linux
    - tmux
keywords:
    - linux
    - tmux
    - ssh
    - X Server
---
Quando utilizamos um terminal, a variável `$DISPLAY` é responsável por informar às aplicações gráficas o endereço do servidor gráfico X. Ao reconectar à uma sessão tmux, a variável `$DISPLAY` poderá estar desatualizada.
<!-- more -->

Imagine que a situação onde o usuário faz _login_ no servidor através de SSH, inicia uma sessão tmux, destaca a sessão e faz _logout_. Algum tempo depois, volta a fazer _login_, seja via SSH ou até mesmo localmente. Neste ponto a variável `$DISPLAY` está corretamente configurada, mas dentro da sessão tmux ela pode conter informações da antiga sessão. É necessário popular manualmente a variável com o valor atual. Mas como descobrir?

## Procurando o servidor X

Geralmente um usuário logado ao sistema possui um servidor X ativo e este exporta um "display" que pode ser conectado através de uma porta TCP. É assim que aplicações rodando em um servidor remoto conseguem abrir interfaces gráficas (GUI) em nossa máquina local.

No cenário exemplificado, uma forma de descobrir o valor para a variável `$DISPLAY` seria, antes de abrir o tmux, imprimir o valor corrente e, dentro do tmux atribuir o valor novo:

{% codeblock bash %}
$ echo $DISPLAY
localhost:10.0

$ tmux attach
[...]
$ export DISPLAY='localhost:10.0'
{% endcodeblock %}

Repare que o formato do endereço é `<ip_ou_dominio>:<porta>.<display>`. O servidor X escuta em uma porta TCP geralmente acima dos 6000. No caso, do exemplo acima, a porta TCP seria 6010, sendo o número 10 correspondente ao `<porta>` da variável `$DISPLAY`. Com essa informação podemos, dentro da sessão tmux (ou qualquer outra sessão de terminal), listar os servidores X abertos para o usuário atual:

{% codeblock bash %}
$ netstat -ane | grep "LISTEN " | grep "`id -u`" 
tcp6       0      0 ::1:6010                :::*                    LISTEN      1000       160206
tcp        0      0 127.0.0.1:6010          0.0.0.0:*               LISTEN      1000       160207
{% endcodeblock %}

Usamos o `netstat` para listar as portas TCP, filtramos com `grep` pelas portas que estão em estado `LISTEN` e que pertencem ao usuário corrente (`id -u`). Como geralmente acessamos os terminais localmente ou via SSH[^1], estamos interessados apenas no `localhost` ou IP `127.0.0.1`. Mais um filtro com `grep` para pegar apenas os IPs `localhost` e pronto. Tudo isso colocado em uma função `bash` que pode ser convenientemente chamada para acertar a variável `$DISPLAY` sempre que necessário.

{% gist 259e4030dce480e8a3e7d24e219175aa %}

O código da função é simples mas note que usei um `sort` para ordenar a saída pelo PID e um `tail` para selecionar a última entrada. Esse passo serve apenas para ordenar as sessões concorrentes que possam existir na mesma máquina, pegando sempre o PID mais alto. Isso _garante[^2]_ a seleção do mais recente.

## Conclusão

Uma função simples que resolve um problema constante no meu ambiente de trabalho onde acesso um servidor compartilhado através de SSH. A cada sessão reiniciada as chances do meu número de display mudar é muito grande. Espero que seja útil para mais alguém. 

[^1]: O ssh pode fazer o chamado _X forward_ que é o tunelamento do tráfego do servidor X. Para habilitar essa opção é preciso chamar o cliente ssh com parâmetro `-x`: `$ ssh -x <endereço>`.
[^2]: No Unix o PID é sempre incremental, porém, quando o valor máximo é alcançado ele reinicia do zero. Nesse caso a lógica irá falhar mas isso será muito muito raro. 
