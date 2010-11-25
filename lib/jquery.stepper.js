(function($) {

  var opts, el;

  $.fn.extend({
    stepper: function(options) {
      opts = $.extend({}, $.fn.stepper.defaults, options);
      // This will be called on an element or collection of elements
      return this.each(initialise);
    }
  });

  $.fn.stepper.defaults = {
    progressive: 'false',
    step_el: "li",
    event_names: {
      goForward: "goForward",
      goBackward: "goBackward",
      nudgeForward: "nudgeForward",
      nudgeBackward: "nudgeBackward",
      activate: "activate",
      deactivate: "deactivate"
    },
    class_names: {
      active: "active",
      inactive: "inactive"
    }
  };

  // Private functions
  function initialise () {
    // This is an instance of stepper. Set it up.
    el = this;
    // Setup step progression
    setupStepProgression();
    // Deactivate all
    $(el)
      .find(opts.step_el)
        .trigger(opts.event_names.deactivate);
    // Activate first one
    $(el)
      .find(opts.step_el).first()
        .trigger(opts.event_names.activate);
  }

  function setupStepProgression () {
    // Child handled progression
    $(el)
      .find(opts.step_el)
        .bind(opts.event_names.goBackward, function() {
          var prev = $(this).prevAll(opts.step_el).first();
          if (prev.length) {
            prev.trigger(opts.event_names.activate);
          }
        })
        .bind(opts.event_names.goForward, function() {
          var next = $(this).nextAll(opts.step_el).first();
          if (next.length) {
            next.trigger(opts.event_names.activate);
          }
        })
        .bind(opts.event_names.activate, function() {
          var step = $(this);
          // If this is a progressive one, we want to keep preceding steps active
          if (opts.progressive === true) {
            // Deactivate any steps after this
            step.nextAll(opts.step_el).each(function () {
              var step = $(this);
              if (step.hasClass(opts.class_names.active)) {
                step.trigger(opts.event_names.deactivate);
              }
            });
            // Activate all steps before this
            step.prevAll(opts.step_el).each(function () {
              var step = $(this);
              if (step.hasClass(opts.class_names.inactive)) {
                step.trigger(opts.event_names.activate);
              }
            });
            //
          } else {
            // Deactivate active step
            $(getActiveStep()).trigger(opts.event_names.deactivate);
          }
          // Activate this one
          $(this)
            .addClass(opts.class_names.active)
            .removeClass(opts.class_names.inactive);
        })
        .bind(opts.event_names.deactivate, function() {
          $(this)
            .addClass(opts.class_names.inactive)
            .removeClass(opts.class_names.active);
        });
    // Parent handled progression
    $(el)
      .bind(opts.event_names.nudgeForward, function() {
        $(getActiveStep()).trigger(opts.event_names.goForward);
      })
      .bind(opts.event_names.nudgeBackward, function() {
        $(getActiveStep()).trigger(opts.event_names.goBackward);
      });
  }

  function getActiveStep () {
    return $(el).children(opts.step_el + "." + opts.class_names.active);
  }

})(jQuery);
