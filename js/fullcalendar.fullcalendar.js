/**
 * @file
 * Processes the FullCalendar options and passes them to the integration.
 */

(function ($) {

Drupal.fullcalendar.plugins.fullcalendar = {
  options: function (fullcalendar) {
    var settings = Drupal.settings.fullcalendar[fullcalendar.dom_id];
    var options = {
      defaultView: settings.defaultView,
      theme: settings.theme,
      header: {
        left: settings.left,
        center: settings.center,
        right: settings.right
      },
      isRTL: settings.isRTL === '1',
      eventClick: function (calEvent, jsEvent, view) {
        if (settings.colorbox) {
          // Open in colorbox if exists, else open in new window.
          if ($.colorbox) {
            var url = calEvent.url;
            if(settings.colorboxClass !== '') {
              url += ' ' + settings.colorboxClass;
            }
            $.colorbox({
              href: url,
              width: settings.colorboxWidth,
              height: settings.colorboxHeight
            });
          }
        }
        else {
          if (settings.sameWindow) {
            window.open(calEvent.url, '_self');
          }
          else {
            window.open(calEvent.url);
          }
        }
        return false;
      },
      year: (settings.year) ? settings.year : undefined,
      month: (settings.month) ? settings.month - 1 : undefined,
      date: (settings.day) ? settings.day : undefined,
      timeFormat: {
        agenda: (settings.clock) ? 'HH:mm{ - HH:mm}' : settings.agenda,
        '': (settings.clock) ? 'HH:mm' : settings.agenda
      },
      axisFormat: (settings.clock) ? 'HH:mm' : 'h(:mm)tt',
      weekMode: settings.weekMode,
      firstDay: settings.firstDay,
      monthNames: settings.monthNames,
      monthNamesShort: settings.monthNamesShort,
      dayNames: settings.dayNames,
      dayNamesShort: settings.dayNamesShort,
      allDayText: settings.allDayText,
      buttonText: {
        today: settings.todayString,
        day: settings.dayString,
        week: settings.weekString,
        month: settings.monthString
      },
      events: function (start, end, callback) {
        fullcalendar.parseEvents(callback);

        // Add events from Google Calendar feeds.
        for (var entry in settings.gcal) {
          if (settings.gcal.hasOwnProperty(entry)) {
            $('.fullcalendar', fullcalendar.$calendar).fullCalendar('addEventSource',
              $.fullCalendar.gcalFeed(settings.gcal[entry][0], settings.gcal[entry][1])
            );
          }
        }
      },
      eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc) {
        $.post(
          Drupal.settings.basePath + 'fullcalendar/ajax/update/drop/' + event.nid,
          'field=' + event.field + '&index=' + event.index + '&day_delta=' + dayDelta + '&minute_delta=' + minuteDelta + '&all_day=' + allDay + '&dom_id=' + event.dom_id,
          fullcalendar.update
        );
        return false;
      },
      eventResize: function (event, dayDelta, minuteDelta, revertFunc) {
        $.post(
          Drupal.settings.basePath + 'fullcalendar/ajax/update/resize/' + event.nid,
          'field=' + event.field + '&index=' + event.index + '&day_delta=' + dayDelta + '&minute_delta=' + minuteDelta + '&dom_id=' + event.dom_id,
          fullcalendar.update
        );
        return false;
      }
    };
    return options;
  }
};

}(jQuery));
