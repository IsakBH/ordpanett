<?php
if(!isset($_SESSION['user'])){
    header('Location: /ordpanett/pages/auth/login.php');
    exit("Bruker er ikke logget inn, og blir derfor redirectet til login siden.");
}
