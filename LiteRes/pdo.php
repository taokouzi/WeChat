<?php
//	$dsn = 'mysql:host=localhost;dbname=htmlplatform';
$dsn = 'mysql:host=localhost;dbname=lite';
$user = 'root';
$password = '';
// $user = 'h5';
// $password = '58137161';

try{
  $pdo = new PDO($dsn, $user, $password)  or  die("Connect MySql Error");
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->exec("set names utf8");
}
catch (PDOException $e){
  echo 'Connection failed: ' . $e->getMessage();
}


?>