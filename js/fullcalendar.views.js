/**
 * @file
 * Integrates Views data with the FullCalendar plugin.
 */

(function ($) {

Drupal.fullcalendar = {};

Drupal.behaviors.fullcalendar = function(context) {
  // Process each view and its settings.
  $.each(Drupal.settings.fullcalendar, function(dom_id, settings) {
    // Create an object of this calendar.
    var calendar = $(dom_id);

    // Hide the failover display.
    $('.fullcalendar-content', calendar).hide();

    var options = {
      defaultView: settings.defaultView,
      theme: settings.theme,
      header: {
        left: settings.left,
        center: settings.center,
        right: settings.right
      },
      isRTL: settings.isRTL === '1',
      eventClick: function(calEvent, jsEvent, view) {
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
      events: function(start, end, callback) {
        Drupal.fullcalendar.parseEvents(dom_id, calendar, callback);

        // Add events from Google Calendar feeds.
        $.each(settings.gcal, function(i, gcalEntry) {
          $('.fullcalendar', calendar).fullCalendar('addEventSource',
            $.fullCalendar.gcalFeed(gcalEntry[0], gcalEntry[1])
          );
        });
      },
      eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc) {
        $.post(Drupal.settings.basePath + 'fullcalendar/ajax/update/drop/'+ event.nid,
          'field=' + event.field + '&index=' + event.index + '&day_delta=' + dayDelta + '&minute_delta=' + minuteDelta + '&all_day=' + allDay + '&dom_id=' + event.dom_id,
          Drupal.fullcalendar.update);
        return false;
      },
      eventResize: function(event, dayDelta, minuteDelta, revertFunc) {
        $.post(Drupal.settings.basePath + 'fullcalendar/ajax/update/resize/'+ event.nid,
          'field=' + event.field + '&index=' + event.index + '&day_delta=' + dayDelta + '&minute_delta=' + minuteDelta + '&dom_id=' + event.dom_id,
          Drupal.fullcalendar.update);
        return false;
      }
    };

    // Use :not to protect against extra AJAX calls from Colorbox.
    $('.fullcalendar:not(.fc-processed)', calendar).addClass('fc-processed').fullCalendar(options);
  });


  $('.fullcalendar-status-close').live('click', function() {
    $(this).parent().slideUp();
    return false;
  });

  // Trigger a window resize so that calendar will redraw itself as it loads funny in some browsers occasionally
  $(window).resize();
};

Drupal.fullcalendar.parseEvents = function(dom_id, calendar, callback) {
  var events = [];
  $('.fullcalendar-event-details', calendar).each(function() {
    events.push({
      field: $(this).attr('field'),
      index: $(this).attr('index'),
      nid: $(this).attr('nid'),
      title: $(this).attr('title'),
      start: $(this).attr('start'),
      end: $(this).attr('end'),
      url: $(this).attr('href'),
      allDay: ($(this).attr('allDay') === '1'),
      className: $(this).attr('cn'),
      editable: $(this).attr('editable'),
      dom_id: dom_id
    });
  });
  callback(events);
}

Drupal.fullcalendar.update = function(response) {
  var result = Drupal.parseJson(response);
  fcStatus = $(result.dom_id).find('.fullcalendar-status');
  if (fcStatus.text() === '') {
    fcStatus.html(result.msg).slideDown();
  }
  else {
    fcStatus.effect('highlight', {}, 5000);
  }
  return false;
};

})(jQuery);
