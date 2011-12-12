/**
 * @file
 * Integrates Views data with the FullCalendar plugin.
 */

(function ($) {

Drupal.behaviors.fullcalendar = function (context) {
  // Process each view and its settings.
  for (var dom_id in Drupal.settings.fullcalendar) {
    if (Drupal.settings.fullcalendar.hasOwnProperty(dom_id)) {
      var fullcalendar = new Drupal.fullcalendar.fullcalendar(dom_id);
    }
  }

  // Trigger a window resize so that calendar will redraw itself.
  $(window).resize();
};

}(jQuery));
