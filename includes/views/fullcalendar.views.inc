<?php

/**
 * @file
 * Contains views module hooks
 */

/**
 * Implementation of hook_views_plugins().
 */
function fullcalendar_views_plugins() {
  $module_path = drupal_get_path('module', 'fullcalendar');
  $theme_path = $module_path . '/theme';
  $path = $module_path . '/includes/views/plugins';
  return array(
    'display' => array(
      'fullcalendar' => array(
        'title' => t('FullCalendar'),
        'handler' => 'fullcalendar_plugin_display_page',
        'help' => t('For use with FullCalendar style'),
        'path' => $path,
        'parent' => 'page',
        'theme' => 'views_view',
        'uses hook menu' => TRUE,
      ),
    ),
    'style' => array(
      'fullcalendar' => array(
        'title' => t('FullCalendar'),
        'help' => t('Displays items on a calendar.'),
        'handler' => 'views_plugin_style_fullcalendar',
        'path' => $path,
        'theme' => 'views_view_fullcalendar',
        'theme file' => 'theme.inc',
        'theme path' => $theme_path,
        'uses row plugin' => TRUE,
        'uses options' => TRUE,
        'uses grouping' => TRUE,
        'type' => 'normal',
        'parent' => 'default',
      ),
    ),
    'row' => array(
      'fullcalendar_node' => array(
        'title' => t('Fields (FullCalendar)'),
        'help' => t('For use with FullCalendar style'),
        'handler' => 'views_plugin_node_fullcalendar',
        'path' => $path,
        'theme' => 'views_view_node_fullcalendar',
        'theme file' => 'theme.inc',
        'theme path' => $theme_path,
        'uses fields' => TRUE,
        'uses options' => TRUE,
        'type' => 'normal',
      ),
    ),
  );
}
