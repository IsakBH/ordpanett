<?php
$host = 'localhost';
$username = 'isak';
$password = 'some_pass';
$database = 'mydb';

$mysqli = new mysqli($host, $username, $password, $database);

if ($mysqli->connect_error) {
    die("Tilkobling mislykket: " . $mysqli->connect_error);
}