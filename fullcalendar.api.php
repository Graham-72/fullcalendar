<?php

/**
 * @file
 * Hooks provided by the FullCalendar module.
 */

/**
 * @addtogroup hooks
 * @{
 */

/**
 * Constructs CSS classes for an node.
 *
 * @param $node
 *   Object representing the node.
 *
 * @return
 *   Array of CSS classes.
 */
function hook_fullcalendar_classes($node) {
  // Add the node type as a class.
  return array(
    $node->type,
  );
}

/**
 * Alter the CSS classes for an node.
 *
 * @param $classes
 *   Array of CSS classes.
 * @param $node
 *   Object representing the node.
 *
 */
function hook_fullcalendar_classes_alter(&$classes, $node) {
  // Remove all classes set by modules.
  $classes = array();
}

/**
 * @} End of "addtogroup hooks".
 */
