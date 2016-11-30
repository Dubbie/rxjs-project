<?php
  session_start();

  include '../db.php';

  // The jist
  $success = false;
  $response = array();
  $user = array();

  if (isset($_SESSION['uid'])) {
    $expired = true;
    $date_now = time();
    $timestamp = date('Y-m-d H:i:s',$date_now);

    // If more than 5 minutes ago, log the user out.
    $stmt = $conn->prepare('SELECT `username`, `color`, `last_active` FROM `users` WHERE `id` = ?');
    $stmt->bind_param('i',$_SESSION['uid']);
    $stmt->bind_result($_username, $_color, $_timestamp);
    $stmt->execute();
    while ($stmt->fetch()) {
      $user['username'] = $_username;
      $user['color'] = $_color;

      $expired = (strtotime($_timestamp) + (5 * 60)) < $date_now;
    }
    $stmt->close();

    // If less than 5 minutes ago, log the user in.
    if ($expired) {
      session_destroy();
    } else {
      $stmt = $conn->prepare('UPDATE `users` SET `last_active` = ? WHERE `id` = ?');
      $stmt->bind_param('si',$timestamp,$_SESSION['uid']);
      if ($stmt->execute()) {
        $success = true;
      }
      $stmt->close();
    }

  } else {
    // Init variables
    $uid = -1;
    $uname = strtolower(stripslashes($_POST['username']));
    $color = 'ffffff';

    $stmt = $conn->prepare('SELECT `id` FROM `users` WHERE `username` = ?');
    $stmt->bind_param('s',$uname);
    $stmt->bind_result($_uid);
    $stmt->execute();
    while ($stmt->fetch()) {
      $uid = $_uid;
    }
    $stmt->close();

    if ($uname != '') {
      if ($uid == -1) {

        $stmt = $conn->prepare('INSERT INTO `users` (`username`,`color`) VALUES (?, ?)');
        $stmt->bind_param('ss',$uname,$color);
        if ($stmt->execute()) {
          $_SESSION['uid'] = $conn->insert_id;

          $success = true;
        }
        $stmt->close();
      } else {
        $date_now = time();
        $date_expire = null;

        // Get last active
        $stmt = $conn->prepare('SELECT `color`,`last_active` FROM `users` WHERE `username` = ?');
        $stmt->bind_param('s',$uname);
        $stmt->bind_result($_color, $_last_active);
        $stmt->execute();
        while ($stmt->fetch()) {
          $color = $_color;
          $date_expire = strtotime($_last_active) + (5 * 60);
        }
        $stmt->close();

        if ($date_expire < $date_now) {
          $timestamp = date('Y-m-d H:i:s',$date_now);
          $stmt = $conn->prepare('UPDATE `users` SET `last_active` = ? WHERE `username` = ?');
          $stmt->bind_param('ss',$timestamp,$uname);
          if ($stmt->execute()) {
            $_SESSION['uid'] = $uid;

            $user['username'] = $uname;
            $user['color'] = $color;

            $success = true;
          }
          $stmt->close();
        }
      }
    }
  }

  if ($success) {
    $response['data'] = $user;
  }
  $response['success'] = $success;
  echo json_encode($response, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);
?>
