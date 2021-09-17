<?php

$dsn = "mysql:host=localhost;dbname=mydb";
$user = "user";
$passwd = "user";

$pdo = new PDO($dsn, $user, $passwd);

$stm = $pdo->query("SELECT VERSION()");

$version = $stm->fetch();

echo $version[0] . PHP_EOL;

?>
