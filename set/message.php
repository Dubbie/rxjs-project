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

  // Variables
  $uid = isset($_SESSION['uid']) ? $_SESSION['uid'] : -1;
  $msg = trim(stripslashes($_POST['message']));
  $timestamp = date('Y-m-d H:i:s');
  $short_timestamp = date('G:i');

  $line = array();
  $success = false;
  $response = array();

  if ($uid != -1 && strlen($msg) > 0) {
    $stmt = $conn->prepare('INSERT INTO `messages` (`uid`,`message`) VALUES (?, ?)');
    $stmt->bind_param('is',$uid,$msg);
    if ($stmt->execute()) {
      $success = true;
    }
    $stmt->close();

    $stmt = $conn->prepare('UPDATE `users` SET `last_active` = ? WHERE `id` = ?');
    $stmt->bind_param('si', $timestamp, $uid);
    $stmt->execute();
    $stmt->close();

    $stmt = $conn->prepare('SELECT `username`, `color` FROM `users` WHERE `id` = ?');
    $stmt->bind_param('i', $uid);
    $stmt->bind_result($_username, $_color);
    $stmt->execute();
    while ($stmt->fetch()) {
      $line['username'] = $_username;
      $line['color'] = $_color;
      $line['timeStamp'] = $timestamp;
      $line['shortTimeStamp'] = $short_timestamp;
      $line['message'] = $msg;
    }
    $stmt->close();
  }

  $response['success'] = $success;
  $response['data'] = $line;
  echo json_encode($response, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);
?>
