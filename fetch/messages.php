<?php
  include '../db.php';

  $data = array();
  $html = '';
  $success = false;

  // Return messages
  $stmt = $conn->prepare('
  SELECT `users`.`username`, `users`.`color`, `messages`.`message`, `messages`.`timestamp`
  FROM `users`
  INNER JOIN `messages`
  ON `users`.`id` = `messages`.`uid` AND `messages`.`timestamp` >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
  ORDER BY `messages`.`timestamp`
  ');
  $stmt->bind_result($_uname, $_color, $_message, $_timestamp);
  if ($stmt->execute()) {
    $success = true;
  }
  while ($stmt->fetch()) {
    $_short_timestamp = date('G:i', strtotime($_timestamp));

    $line = array(
      'username' => $_uname,
      'color' => $_color,
      'message' => $_message,
      'timeStamp' => $_timestamp,
      'shortTimeStamp' => $_short_timestamp
    );

    $html .= '<li class="chat-message">
      <span class="chat-timestamp" data-timestamp="'.$_timestamp.'">'.$_short_timestamp.'</span><span class="chat-username" data-username="'.$_uname.'" style="color: #'.$_color.'">'.$_uname.':</span><span class="chat-message" data-message="'.$_message.'">'.$_message.'</span>
    </li>';

    $data[] = $line;
  }
  $stmt->close();

  // Response creation
  $response = array();
  $response['data'] = $data;
  $response['html'] = $html;
  $response['success'] = $success;

  echo json_encode($response, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);
?>
