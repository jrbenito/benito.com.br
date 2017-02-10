---
title: "Variável DISPLAY em sessões tmux"
date: 2017-02-10 11:40:00
tags:
    - linux
    - tmux
keywords:
    - linux
    - tmux
    - ssh
    - X Server
---
Quanto utilizamos um terminal, seja remotamente via SSH ou localmente através de um emulador dentro do ambiente gráfico, a variável DISPLAY é responsável por informar às aplicações gráficas o endereço do servidor gráfico X. Ao utilizar o comando `$ssh -x`, o próprio SSH já configura o túnel entre seu cliente e a máquina remota. Ao abrir um terminal no ambiente gráfico, essa variável já é automaticamente populada. O problema é acontece quando usamos ferramentas tipo tmux que são capazes de manter uma sessão aberta mesmo após fecharmos o terminal de origem.
<!-- more -->

Imagine que a situação onde o usuário faz _login_ no servidor através de SSH, inicia uma sessão tmux, destaca a sessão e faz _logout_. Algum tempo depois o usuário faz novo _login_, seja via SSH ou até mesmo localmente. Neste ponto a variável DISPLAY está corretamente configurada para o novo servidor X referente a esse novo login. Não nenhuma garantia que esse servidor (IP e porta) seja o mesmo da sessão anterior. Ao abrir a sessão tmux do outro login, aplicações gráficas podem não funcionar pois, naquele terminal, a variável DISPLAY está incorreta. O usuário necessita manualmente popular a variável com o valor atual. Mas como descobrir?

## Procurando o servidor X

Todo usuário com sessão ativa no sistema pode ter um "display" rodando. Cada display é um servidor X, e como todo servidor capaz de trafegar em redes IP, o display é representado pelo IP do servidor e a porta correspondente ao display. Não vamos falar aqui das questões de autenticação pois não são o foco deste artigo.

No cenário exemplificado, uma forma de descobrir o valor para a variável DISPLAY seria, antes de abrir o tmux, imprimir o valor corrente e, dentro do tmux atribuir o valor novo:

{% tabbed_codeblock tabbed_codeblock %}
<!-- tab bash -->
$ echo $DISPLAY
localhost:10.0

$ tmux attach
[...]
$ export DISPLAY='localhost:10.0'
<!-- endtab -->
{% endtabbed_codeblock %}

Repare que o formato do endereço é `<ip_ou_dominio>:<nro_display>.0`. O servidor X escuta em uma porta TCP geralmente acima dos 6000. No caso, do exemplo acima, a porta TCP seria 6010, sendo o número 10 correspondente ao `<nro_display>`. Com essa informação podemos, dentro da sessão tmux (ou qualquer outra sessão de terminal), listar os displays X abertos para o usuário atual:

{% tabbed_codeblock tabbed_codeblock %}
<!-- tab bash -->
$ netstat -ane | grep "LISTEN " | grep "`id -u`" 
tcp6       0      0 ::1:6010                :::*                    LISTEN      1000       160206
tcp        0      0 127.0.0.1:6010          0.0.0.0:*               LISTEN      1000       160207
<!-- endtab -->
{% endtabbed_codeblock %}

Usamos o `netstat` para listar as portas TCP, filtramos com `grep` pelas portas que estão em estado `LISTEN` e que pertencem ao usuário corrente (`id -u`). Como geralmente acessamos os terminais localmente ou via SSH (que faz o tunelamento do X localmente), estamos interessados apenas no `localhost` ou IP `127.0.0.1`. Mais um filtro com `grep` para pegar apenas os IPs `localhost` e, no meu caso que as vezes tenho várias sessões abertas no servidor, um `tail` para retornar apenas a última entrada. Tudo isso colocado em uma função `bash` que pode ser convenientemente chamada para acertar a variável `$DISPLAY` sempre que necessário.

{% gist 259e4030dce480e8a3e7d24e219175aa %}

O código da função é simples mas note que usei um `sort` para ordenar a saída pelo PID. Esse passo serve apenas para ordenar as sessões concorrentes que tenho no mesmo servidor pegando sempre o PID mais alto. Isso garante[^1] que o display retornado é sempre o mais recente.

## Conclusão

Uma função simples que resolve um problema constante no meu ambiente de trabalho onde acesso um servidor através de SSH e que é compartilhado. A cada sessão reiniciada as chances do meu número de display mudar é muito grande. Espero que seja útil para mais alguém. 

[^1]: No Unix o PID é sempre incremental, porém, quando o valor máximo é alcançado ele reinicia do zero. Nesse caso a lógica irá falhar mas isso será muito muito raro. 

