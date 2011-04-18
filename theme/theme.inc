<?php

/**
 * Passes options to the FullCalendar plugin as JavaScript settings.
 */
function template_preprocess_fullcalendar(&$vars) {
  $vars['options']['dom_id'] = '.view-dom-id-' . $vars['id'];
  fullcalendar_get_settings($vars['options']);
}

/**
 * Prepares variables for template file invoked for node row type.
 */
function template_preprocess_fullcalendar_fields(&$vars) {

  // Get all the fields from the view.
  $fields = $vars['view']->display_handler->get_field_labels();

  if (isset($vars['view']->empty_text)) {
    $vars['empty_text'] = $vars['view']->empty_text;
    return;
  }
  $nid = $vars['row']->{$vars['field_alias']};
  if (!is_numeric($nid)) {
    return;
  }
  $node = node_load($nid);
  if (empty($node)) {
    return;
  }

  // Allow resize/drag/drop of an event if user has proper permissions.
  $node->editable = _fullcalendar_update_access($node);
  $node->class = theme('fullcalendar_classname', $node);

  $vars['node'] = $node;
  $vars['data'] = array(); // Contains the start, end & allDay values.

  // Default URL.
  $node->url = 'node/' . $nid;

  // Fetch custom URL if needed.
  if (!empty($vars['options']['custom']['fc_url'])) {
    if ($url_field = $vars['options']['custom']['fc_url_field']) {
      if (isset($node->{$url_field})) {
        $node->url = $node->{$url_field};
      }
    }
  }

  // Fetch custom title if needed.
  if (!empty($vars['options']['custom']['fctitle'])) {
    $title_field = $vars['options']['custom']['fc_title_field'];
    if (!empty($title_field) && !empty($node->{$title_field})) {
      $node->title = $node->{$title_field};
    }
  }

  // Fetch custom dates if needed.
  if (!empty($vars['options']['custom']['fc_date'])) {
    $fields = array_intersect_key($fields, $vars['options']['custom']['fc_date_fields']);
  }

  // Iterate through available fields, using the first one found.
  foreach (fullcalendar_date_fields($fields) as $field_name => $field) {
    foreach ($node->{$field['field_name']} as $index => $item) {
      if (!empty($item['value'])) {
        $vars['data'][] = _fullcalendar_set_display_times($node, $field['field_name'], $field, $item, $index);
      }
    }
  }
}
