<?php
// $Id$

/**
 * @file
 * View to display the fullcalendar rows (events)
 *
 * Variables available:
 * - $node: The node object.
 * - $url: The url for the event
 * - $data['field']: The field that contains the event date and time.
 * - $data['index']: The index of the event date and time (to support multiple values).
 * - $data['allDay']: If the event is all day (does not include hour and minute granularity).
 * - $data['start'] : When the event starts.
 * - $data['end'] : When the event ends.
 * - $className : The node type that the event came from
 *
 * Note that if you use className for the event's className attribute then you'll get weird results from jquery!
 */

?>
<div class="fullcalendar_event">
  <?php foreach ($data as $row): ?>
    <a class="fullcalendar_event_details" cn="<?php echo $className; ?>" href="<?php echo $url; ?>"
      field="<?php echo $row['field']; ?>" index="<?php echo $row['index']; ?>"
      nid="<?php echo $node->nid; ?>" title="<?php echo $node->title; ?>"
      allDay="<?php echo $row['allDay']; ?>" start="<?php echo $row['start']; ?>" end="<?php echo $row['end']; ?>"
      editable="<?php echo $editable; ?>"><?php echo $node->title; ?></a>

    : <?php echo $row['start_formatted']; ?>

    <?php if (!$row['allDay'] && !empty($row['end'])): ?>
      to <?php echo $row['end_formatted']; ?>
    <?php endif; ?>

  <?php endforeach; ?>
</div>
