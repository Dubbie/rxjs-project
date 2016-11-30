<?php
  include '../db.php';

  $data = array();
  $html = '';
  $success = false;

  // Return messages
  $stmt = $conn->prepare('
  SELECT `username`, `color`
  FROM `users`
  WHERE `last_active` >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
  ORDER BY `username`
  ');
  $stmt->bind_result($_uname, $_color);
  $stmt->execute();
  while ($stmt->fetch()) {
    $line = array(
      'username' => $_uname,
      'color' => $_color
    );

    $data[] = $line;
    $success = true;
  }
  $stmt->close();

  // Response creation
  $response = array();
  $response['data'] = $data;
  $response['success'] = $success;

  echo json_encode($response, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);
?>
