<?php
if (!$_SESSION['user_id']){
    session_start();
}

require_once __DIR__ . '/config/database.php';
?>

<!DOCTYPE html>
<html lang="no">
    <head>
        <title>Ord På Nett</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <!--<link rel="icon" href="assets/logo.png">-->

        <!-- Stylesheets -->
        <link rel="stylesheet" href="styling/styles.css">

        <!-- Ikoner fra Font Awesome og Google Fonts -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
    </head>

    <body>
        <p>Ord På Nett</p>
    </body>
</html>