(function ($) {

Drupal.fullcalendar = Drupal.fullcalendar || {};
Drupal.fullcalendar.plugins = Drupal.fullcalendar.plugins || {};

Drupal.fullcalendar.fullcalendar = function (dom_id) {
  this.dom_id = dom_id;
  this.$calendar = $(dom_id);
  this.$options = {};
  var fullcalendar = this;

  var settings = Drupal.settings.fullcalendar[this.dom_id];
  this.$options = {
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
      $.each(settings.gcal, function (i, gcalEntry) {
        $('.fullcalendar', this.$calendar).fullCalendar('addEventSource',
          $.fullCalendar.gcalFeed(gcalEntry[0], gcalEntry[1])
        );
      });
    },
    eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc) {
      $.post(Drupal.settings.basePath + 'fullcalendar/ajax/update/drop/'+ event.nid,
        'field=' + event.field + '&index=' + event.index + '&day_delta=' + dayDelta + '&minute_delta=' + minuteDelta + '&all_day=' + allDay + '&dom_id=' + event.dom_id,
        fullcalendar.update);
      return false;
    },
    eventResize: function (event, dayDelta, minuteDelta, revertFunc) {
      $.post(Drupal.settings.basePath + 'fullcalendar/ajax/update/resize/'+ event.nid,
        'field=' + event.field + '&index=' + event.index + '&day_delta=' + dayDelta + '&minute_delta=' + minuteDelta + '&dom_id=' + event.dom_id,
        fullcalendar.update);
      return false;
    }
  };

  // Hide the failover display.
  $('.fullcalendar-content', this.$calendar).hide();

  // Use :not to protect against extra AJAX calls from Colorbox.
  $('.fullcalendar:not(.fc-processed)', this.$calendar).addClass('fc-processed').fullCalendar(this.$options);

  $('.fullcalendar-status-close', this.$calendar).live('click', function () {
    $(this).parent().slideUp();
    return false;
  });
};

Drupal.fullcalendar.fullcalendar.prototype.update = function (response) {
  var result = Drupal.parseJson(response);
  var fcStatus = $(result.dom_id).find('.fullcalendar-status');
  if (fcStatus.is(':hidden')) {
    fcStatus.html(result.msg).slideDown();
  }
  else {
    fcStatus.effect('highlight');
  }
  Drupal.attachBehaviors();
  return false;
};

Drupal.fullcalendar.fullcalendar.prototype.parseEvents = function (callback) {
  var events = [];
  var details = $('.fullcalendar-event-details', this.$calendar);
  for (var i = 0; i < details.length; i++) {
    var event = $(details[i]);
    events.push({
      field: event.attr('field'),
      index: event.attr('index'),
      nid: event.attr('nid'),
      title: event.attr('title'),
      start: event.attr('start'),
      end: event.attr('end'),
      url: event.attr('href'),
      allDay: (event.attr('allDay') === '1'),
      className: event.attr('cn'),
      editable: event.attr('editable'),
      dom_id: this.dom_id
    });
  }
  callback(events);
};

})(jQuery);
