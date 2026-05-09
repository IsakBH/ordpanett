<?php
//session_start();
require_once __DIR__ . '/../../config/database.php';

// håndter innlogging
if ($_SERVER['REQUEST_METHOD'] === "POST"){
    $brukernavn = $_POST['brukernavn'];
    $brukernavn = $mysqli->real_escape_string($brukernavn);
    $passord = $_POST['passord'];

    // henter data fra databasen
    $sql = "SELECT * FROM users WHERE username = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("s", $brukernavn);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    // variabler fra queryen
    $database_bruker_id = $user['id'];
    $database_brukernavn = $user['username'];
    $database_passord = $user['password'];
    $database_profilbilde = $user['profile_picture'];

    // sjekker brukernavn og passord opp mot databasen og sammenligner
    if ($user && password_verify($passord, $database_passord)) {
        $_SESSION['bruker_id'] = $database_bruker_id;
        $_SESSION['brukernavn'] = $database_brukernavn;
        $_SESSION['profilbilde'] = $database_profilbilde;

        header('Location: ../../index.php');
        exit();
    } else {
        $error = "Ugyldig brukernavn eller passord.";
    }
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
                <label>Brukernavn / e-postadresse:</label>
                <input type="text" name="brukernavn" placeholder="Isak" required> <br>

                <label>Passord:</label>
                <input type="Password" name="passord" placeholder="Passord01!" required> <br>

                <button type="submit" class="submit" id="login-submit">Logg inn</button>
            </form>

            <p>Har du ikke bruker enda? <a href="register.php">Registrer deg her!</a></p>
        </div>
    </body>
</html>