<?php

/**
 * Passes options to the FullCalendar plugin as JavaScript settings.
 */
function template_preprocess_fullcalendar(&$vars) {
  $vars['options']['dom_id'] = '.view-dom-id-' . $vars['id'];
  fullcalendar_get_settings($vars['options']);
}

/**
 * Prepares variables for template file invoked for row type.
 */
function template_preprocess_fullcalendar_fields(&$vars) {
  // Check if we have field data.
  if (empty($vars['row'])) {
    return;
  }

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

  // Default URL.
  $node->url = 'node/' . $nid;

  // Fetch custom URL if needed.
  if (!empty($vars['options']['custom']['fc_url'])) {
    $field_name = $vars['options']['custom']['fc_url_field'];
    if (!empty($node->{$field_name})) {
      $node->url = ltrim($node->{$field_name}, '/');
    }
  }

  // Fetch custom title if needed.
  if (!isset($node->title)) {
    $node->title = '';
  }
  if (!empty($vars['options']['custom']['fc_title'])) {
    $field_name = $vars['options']['custom']['fc_title_field'];
    if (!empty($field_name) && !empty($node->{$field_name})) {
      $node->title = $node->{$field_name};
    }
  }

  // Node is built, add it to the preprocess variables.
  $vars['node'] = $node;

  // Fetch custom dates if needed.
  if (!empty($vars['options']['custom']['fc_date'])) {
    $fields = array_intersect_key($fields, $vars['options']['custom']['fc_date_field']);
  }

  $vars['data'] = array();
  // Iterate through available fields.
  foreach (fullcalendar_date_fields($fields) as $field_name => $field) {
    foreach ($node->{$field['field_name']} as $index => $item) {
      // Filter fields without value.
      if (!empty($item['value'])) {
        $vars['data'][] = _fullcalendar_set_display_times($node, $field['field_name'], $field, $item, $index);
      }
    }
  }
}
