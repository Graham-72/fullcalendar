<?php

/**
 * @file
 * Preprocess functions for FullCalendar.
 */

/**
 * Passes options to the FullCalendar plugin as JavaScript settings.
 */
function template_preprocess_fullcalendar(&$vars) {
  $view = $vars['view'];
  $options = $vars['options'];

  static $dom_id = 1;
  if (empty($view->dom_id)) {
    $view->dom_id = 'fc-' . $dom_id++;
  }
  $options['dom_id'] = '.view-dom-id-' . $view->dom_id;
  fullcalendar_get_settings($options);
}

/**
 * Prepares variables for template file invoked for row type.
 */
function template_preprocess_fullcalendar_fields(&$vars) {
  // Check if we have field data.
  if (empty($vars['row'])) {
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

  // Create a string of class names.
  $classes = module_invoke_all('fullcalendar_classes', $node);
  drupal_alter('fullcalendar_classes', $classes, $node);
  $node->class = implode(' ', array_unique($classes));

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
  $date_fields = fullcalendar_date_fields($vars['view']->field);
  if (!empty($vars['options']['custom']['fc_date'])) {
    $date_fields = array_intersect_key($date_fields, $vars['options']['custom']['fc_date_field']);
  }

  $vars['data'] = array();
  // Iterate through all available fields.
  foreach ($date_fields as $field_name => $field) {
    $field_name = str_replace('_value', '', $field_name);
    $field = content_fields($field_name);
    $value = (is_array($node->$field_name)) ? $node->$field_name : array($node->$field_name);
    foreach ($value as $index => $item) {
      // Filter fields without value.
      if (!is_array($item) || !empty($item['value'])) {
        $vars['data'][] = _fullcalendar_set_display_times($node, $field_name, $field, $item, $index);
      }
    }
  }
}
