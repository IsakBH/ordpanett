<?php
//session_start();
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === "POST"){
    $error = "Ingen errors!";
}
?>

<!DOCTYPE html>
<html lang="no">
    <html>
        <title>Ord På Nett - Logg inn</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

        <!-- Stylesheets -->
        <link rel="stylesheet" href="../../styles/authentication.css">

        <!-- Ikoner fra Font Awesome og Google Fonts -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
    </html>

    <body>
        <div class="authentication-container" id="login-container">
            <h2>Logg inn i Ord På Nett</h2>
            <p>Får å få tilgang til ekstra funksjoner, må du logge inn.</p> <br>

            <?php
            if (isset($error)) {
                echo "<div class='error-melding' id='login-error'> $error </div>";
            }
            ?>

            <form method="POST">
                <label>Brukernavn:</label>
                <input type="text" name="brukernavn" placeholder="Isak" required> <br>

                <label>E-postadresse (valgfritt)</label>
                <input type="email" name="epost" placeholder="tulling@tullekoppene.no"> <br>

                <label>Passord:</label>
                <input type="Password" name="passord" placeholder="Passord01!" required>
            </form>
        </div>
    </body>
</html>