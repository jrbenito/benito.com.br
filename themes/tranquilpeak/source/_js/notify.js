(function($) {
  'use strict';

  // Fade out the blog and let drop the Notify card of the author and vice versa

  /**
   * NotifyCard
   * @constructor
   */
  var NotifyCard = function() {
    this.$openBtn = $("#sidebar, #header").find("a[href*='#Notify']");
    this.$closeBtn = $('#Notify-btn-close');
    this.$blog = $('#blog');
    this.$Notify = $('#Notify');
    this.$NotifyCard = $('#Notify-card');
  };

  NotifyCard.prototype = {

    /**
     * Run NotifyCard feature
     * @return {void}
     */
    run: function() {
      var self = this;
      // Detect click on open button
      self.$openBtn.click(function(e) {
        e.preventDefault();
        self.play();
      });
      // Detect click on close button
      self.$closeBtn.click(function(e) {
        e.preventDefault();
        self.playBack();
      });
    },

    /**
     * Play the animation
     * @return {void}
     */
    play: function() {
      var self = this;
      // Fade out the blog
      self.$blog.fadeOut();
      // Fade in the Notify card
      self.$Notify.fadeIn();
      // Small timeout to drop the Notify card after that
      // the Notify card fade in and the blog fade out
      setTimeout(function() {
        self.dropNotifyCard();
      }, 300);
    },

    /**
     * Play back the animation
     * @return {void}
     */
    playBack: function() {
      var self = this;
      // Lift the Notify card
      self.liftNotifyCard();
      // Fade in the blog after that the Notify card lifted up
      setTimeout(function() {
        self.$blog.fadeIn();
      }, 500);
      // Fade out the Notify card after that the Notify card lifted up
      setTimeout(function() {
        self.$Notify.fadeOut();
      }, 500);
    },

    /**
     * Slide the card to the middle
     * @return {void}
     */
    dropNotifyCard: function() {
      var self = this;
      var NotifyCardHeight = self.$NotifyCard.innerHeight();
      // default offset from top
      var offsetTop = ($(window).height() / 2) - (NotifyCardHeight / 2) + NotifyCardHeight;
      // if card is longer than the window
      // scroll is enable
      // and re-define offsetTop
      if (NotifyCardHeight + 30 > $(window).height()) {
        offsetTop = NotifyCardHeight;
      }
      self.$NotifyCard
        .css('top', '0px')
        .css('top', '-' + NotifyCardHeight + 'px')
        .show(500, function() {
          self.$NotifyCard.animate({
            top: '+=' + offsetTop + 'px'
          });
        });
    },

    /**
     * Slide the card to the top
     * @return {void}
     */
    liftNotifyCard: function() {
      var self = this;
      var NotifyCardHeight = self.$NotifyCard.innerHeight();
      // default offset from top
      var offsetTop = ($(window).height() / 2) - (NotifyCardHeight / 2) + NotifyCardHeight;
      if (NotifyCardHeight + 30 > $(window).height()) {
        offsetTop = NotifyCardHeight;
      }
      self.$NotifyCard.animate({
        top: '-=' + offsetTop + 'px'
      }, 500, function() {
        self.$NotifyCard.hide();
        self.$NotifyCard.removeAttr('style');
      });
    }
  };

  $(document).ready(function() {
    var NotifyCard = new NotifyCard();
    NotifyCard.run();
  });
})(jQuery);
