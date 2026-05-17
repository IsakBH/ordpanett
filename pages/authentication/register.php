<?php
require_once __DIR__ . '/../../config/database.php';
session_start();

// håndter registrering
if ($_SERVER['REQUEST_METHOD'] === "POST"){
    $originalt_brukernavn = $_POST['brukernavn'];
    $brukernavn = $originalt_brukernavn;
    $epostadresse = $_POST['epost'];
    $passord = password_hash($_POST['passord'], PASSWORD_BCRYPT);
    $profilbilde = 'default.png';
    $unikt_tall = 1;
    $er_brukernavn_tatt = false;

    $sjekk_om_brukernavn_finnes_sql = "select username from users where username = ?;";
    $stmt = $mysqli->prepare($sjekk_om_brukernavn_finnes_sql);
    $stmt->bind_param("s", $originalt_brukernavn);
    $stmt->execute();
    $result = $stmt->get_result();
    $result = $result->fetch_row();

    if($result){
        echo "Brukernavn finnes allerede, går videre og lager nytt brukernavn";
        $er_brukernavn_tatt = true;
    } else {
        $er_brukernavn_tatt = false;
        $brukernavn = $originalt_brukernavn;
    }

    while ($er_brukernavn_tatt){
        $sql = "select count(username) as antall from users where username = ?;";
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("s", $brukernavn);
        $stmt->execute();

        // sjekker hvis count er større enn null, som da betyr at brukernavnet er tatt :(
        $result = $stmt->get_result()->fetch_row();
        $teller = $result[0];
        $stmt->close();

        if($teller > 0) {
            // bruker finnes allerede
            $er_brukernavn_tatt = true;
            $unikt_tall++;
            $brukernavn = $originalt_brukernavn . $unikt_tall;
        } else {
            // fant et unikt navn!
            $er_brukernavn_tatt = false;
        }
    }

    // håndter opplastning av profilbilder
    if (isset($_FILES['profilbilde']) && $_FILES['profilbilde']['error'] === 0) {
        $allowed = ['jpg', 'jpeg', 'png', 'gif'];
        $profilbilde = $_FILES['profilbilde'];
        $filename = $profilbilde['name'];
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

        // valider og last opp bildet
        if (in_array($ext, $allowed)) {
            $profilbilde = file_get_contents($profilbilde['tmp_name']);

            // konverter bilde til base64
            $profilbilde = base64_encode($profilbilde);
        }
    }

    // skrive til databasen
    $sql = "insert into users (username, email, password, profile_picture) values (?, ?, ?, ?);";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("ssss", $brukernavn, $epostadresse, $passord, $profilbilde);

    if($stmt->execute()) {
        $_SESSION['nylig_registrert_brukernavn'] = $brukernavn;
        $error = "Bruker er registrert med brukernavnet $brukernavn.";
        header("Location: login.php");
        exit;
    } else {
        $error = "Noe gikk galt under registrering av bruker.";
    }
}
?>

<!DOCTYPE html>
<html lang="no">
    <head>
        <title>Ord På Nett - Registrer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

        <!-- Stylesheets -->
        <link rel="stylesheet" href="../../styles/authentication.css">

        <!-- Ikoner fra Font Awesome og Google Fonts -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
    </head>

    <body>
        <div class="authentication-container" id="registrer-container">
            <h2>Registrer ny bruker i Ord På Nett</h2>
            <p>Får å få tilgang til ekstra funksjoner, må du ha en bruker.</p> <br>

            <?php
            if (isset($error)) {
                echo "<div class='error-melding' id='registrer-error'> $error </div>";
            }
            ?>

            <form method="POST">
                <label>Brukernavn:</label>
                <input type="text" name="brukernavn" placeholder="Isak" required> <br>

                <label>E-postadresse (valgfritt):</label>
                <input type="text" name="epost" placeholder="navn@tøffe-gutter.no"> <br>

                <label>Passord:</label>
                <input type="password" name="passord" placeholder="Passord01!" required> <br>

                <label>Profilbilde:</label>
                <input type="file" name="profilbilde"> <br>

                <button type="submit" class="submit" id="registrer-submit">Registrer ny bruker</button>
            </form>

            <p>Har du allerede en bruker? <a href="login.php">Logg inn her!</a></p>
        </div>
    </body>
</html>