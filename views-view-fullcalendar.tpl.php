<?php
// $Id$
/**
 * @file views-view-fullcalendar.tpl.php
 * View to display the fullcalendar
 *
 * Variables available:
 * - $rows: The results of the view query, if any
 * - $options: Options for the fullcalendar style plugin
 * -   fullcalendar_view : the default view for the calendar
 * -   fullcalendar_url_colorbox : whether or not to attempt to use colorbox to open events
 * -   fullcalendar_theme : whether or not to apply a loaded jquery-ui theme
 * -   fullcalendar_header_left : values for the header left region : http://arshaw.com/fullcalendar/docs/display/header/
 * -   fullcalendar_header_center : values for the header center region : http://arshaw.com/fullcalendar/docs/display/header/
 * -   fullcalendar_header_right : values for the header right region : http://arshaw.com/fullcalendar/docs/display/header/
 * -   fullcalendar_weekmode : number of week rows : http://arshaw.com/fullcalendar/docs/display/weekMode/
 */
 
?>
<div id="fullcalendar-status"></div>
<div id="fullcalendar"></div>
<div id="fullcalendar_content">
<?php
for ($i = 0; $i < count($rows); $i++) {
  print $rows[$i];
}
?>
</div>
<script type="text/javascript">
Drupal.behaviors.fullCalendar = function(context) {
  $('#fullcalendar_content').hide(); //hide the failover display
  $('#fullcalendar').fullCalendar({
    defaultView: '<?php echo $options['fullcalendar_view']; ?>',
    theme: <?php echo $options['fullcalendar_theme'] ? 'true' : 'false'; ?>,
    header: {
      left: '<?php echo $options['fullcalendar_header_left']; ?>',
      center: '<?php echo $options['fullcalendar_header_center']; ?>',
      right: '<?php echo $options['fullcalendar_header_right']; ?>'
    },
    eventClick: function(calEvent, jsEvent, view) {
      <?php if ($options['fullcalendar_url_colorbox']): ?>
      // Open in colorbox if exists, else open in new window.
      if ($.colorbox) {
        $.colorbox({href:calEvent.url,iframe:true, width:'80%', height: '80%'});
      } else {
        window.open(calEvent.url);
      }
      <?php else: ?>
      window.open(calEvent.url);
      <?php endif; ?>
      return false;
    },
    <?php if (!empty($options['fullcalendar_defaultyear'])): ?>
      year: <?php echo $options['fullcalendar_defaultyear']; ?>,
    <?php endif; ?>
    <?php if (!empty($options['fullcalendar_defaultmonth'])): ?>
      month: <?php echo $options['fullcalendar_defaultmonth'] - 1; ?>,
    <?php endif; ?>
    <?php if (!empty($options['fullcalendar_defaultday'])): ?>
      day: <?php echo $options['fullcalendar_defaultday']; ?>,
    <?php endif; ?>
    timeFormat: {
      agenda: '<?php echo $options['fullcalendar_timeformat']; ?>'
    },
    weekMode: '<?php echo $options['fullcalendar_weekmode']; ?>',
    events: function(start, end, callback) {
      var events = [];

      $('.fullcalendar_event').each(function() {
        $(this).find('.fullcalendar_event_details').each(function() {
          events.push({
            field: $(this).attr('field'),
            index: $(this).attr('index'),
            nid: $(this).attr('nid'),
            title: $(this).attr('title'),
            start: $(this).attr('start'),
            end: $(this).attr('end'),
            url: $(this).attr('href'),
            allDay: ($(this).attr('allDay') == '1'),
            className: $(this).attr('cn'),
            editable: $(this).attr('editable')
          });
        });
      });

      callback(events);
    },
    eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc) {
      $.post('/fullcalendar/ajax/update/drop/'+ event.nid,
        'field=' + event.field + '&index=' + event.index + '&day_delta=' + dayDelta + '&minute_delta=' + minuteDelta + '&all_day=' + allDay,
        fullcalendarUpdate);
      return false;
    },
    eventResize: function(event, dayDelta, minuteDelta, revertFunc) {
      $.post('/fullcalendar/ajax/update/resize/'+ event.nid,
          'field=' + event.field + '&index=' + event.index + '&day_delta=' + dayDelta + '&minute_delta=' + minuteDelta,
        fullcalendarUpdate);
      return false;
    }
  });

  var fullcalendarUpdate = function(response) {
    var result = Drupal.parseJson(response);
    if ($('#fullcalendar-status').text() == '') {
      $('#fullcalendar-status').html(result.msg).slideDown();
    } else {
      $('#fullcalendar-status').html(result.msg).effect('highlight', {}, 5000);
    }
    return false;
  }

  $('.fullcalendar-status_close').live('click', function() {
    $('#fullcalendar-status').slideUp();
    return false;
  });

  //trigger a window resize so that calendar will redraw itself as it loads funny in some browsers occasionally
  $(window).resize();
};
</script>
