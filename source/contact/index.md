title: Contato
layout: page
comments: false
---
<form class="form-control" action="https://formspree.io/benito+blog@benito.com.br" method="POST">
 <fieldset class="form-control"><label for="name">Seu nome</label>
   <input type="text" name="name" placeholder="Nome" required>
 </fieldset><fieldset class="form-control"><label for="_replyto">Seu email</label>
   <input type="email" name="_replyto" placeholder="examplo@dominio.com.br" required>
 </fieldset><fieldset class="form-control"><label for="message">Mensagem</label>
   <textarea name="message" cols="50" rows="10" placeholder="Message" required></textarea>
 </fieldset><fieldset class="form-control">
<input class="btn" type="submit" value="Enviar"></fieldset>
<input class="hide" type="text" name="_gotcha">
 <input class="hide" type="hidden" name="_subject" value="Message via <%= config.title %>">
 <input type="hidden" name="_next" value="/contact/thanks.html" />
</form>
