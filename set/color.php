<?php
  session_start();

  // Connectar
  $user="root";
  $password="gameSPY23";
  $servername="localhost";
  $dbname = "react";

  $conn = new mysqli($servername,$user,$password,$dbname);
  $conn->query("SET NAMES utf8");

  // Check connection
  if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
  }

  // The jist
  $uid = isset($_SESSION['uid']) ? intval($_SESSION['uid']) : -1;
  $success = false;
  $response = array();

  if (isset($_POST['color']) && $uid != -1) {
    $color = trim(stripslashes($_POST['color']));

    $stmt = $conn->prepare('UPDATE `users` SET `color` = ? WHERE `id` = ?');
    $stmt->bind_param('si', $color, $uid);
    if ($stmt->execute()) {
      $success = true;
      $response['activeColor'] = '#'.$color;
    }
    $stmt->close();

    $stmt = $conn->prepare('SELECT `username` FROM `users` WHERE `id` = ?');
    $stmt->bind_param('i', $uid);
    $stmt->bind_result($_username);
    $stmt->execute();
    while ($stmt->fetch()) {
      $response['username'] = $_username;
    }
    $stmt->close();

  }

  $response['success'] = $success;
  echo json_encode($response, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);
?>
