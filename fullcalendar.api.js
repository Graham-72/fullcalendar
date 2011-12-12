/**
 * FullCalendar plugin implementation.
 */
Drupal.fullcalendar.plugins.awesome = {

  /**
   * Add in FullCalendar options.
   *
   * @param fullcalendar
   *   The fullcalendar object.
   *
   * @see http://arshaw.com/fullcalendar/docs
   */
  options: function (fullcalendar) {
    var settings = Drupal.settings.fullcalendar[fullcalendar.dom_id].awesome;
    var options = $.extend(
      {
        theme: false,
        minTime: 9,
        maxTime: 17
      },
      settings
    );
    return options;
  }
};
