<?php include 'inc/header.php'; ?>

<?php
    require('game-utils.php');
    
    $gameLog = [];

    $firstPlayer = getConnectedUser();

    var_dump($firstPlayer);

    $gameLog['firstPlayer'] = [
        "id" => $firstPlayer["_id"],
        "name" => $firstPlayer["name"]
    ];

    setGameLogFIle($gameLog);


    function getConnectedUser() {
        $url = 'http://localhost:3000/users/me';
        // $connectedUserAuthToken = array('authToken' => $_COOKIE['auth_token']);
        $connectedUserAuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjJlODlkMjlmZTNmODE4OTRiMjVhMWQiLCJpYXQiOjE1OTc1MDAzODF9.ctt_yO337kfyisDaoqOjYWj9xm6r-HtOdTJN6jcOdbs';
        $options = array(
            'http' => array(
                'method'  => 'GET',
                'header' => 'Authorization: Bearer ' . $connectedUserAuthToken
            )
        );
        $context = stream_context_create($options);
        $result = @file_get_contents($url, false, $context);

        return json_decode($result, true);
    }
    
    
?>

<div class="jumbotron" style="display: flex; align-items: center; margin: 5rem 0 1rem 1rem; padding: 0 0 3px 0; flex-direction: column; flex-wrap: wrap;">
    <hr class="my-4" style="padding: 0 70% 0 150px">
    <form class="form-signin" action="login.php" method="POST">
        <h1 class="h3 mb-3 font-weight-normal">Sign in</h1>
        <label for="email" class="sr-only">Email</label>
        <input type="email" name="email" class="form-control">
        <label for="password" class="sr-only">Password</label>
        <input type="password" name="password" class="form-control">
        <button class="btn btn-sm btn-primary btn-block" type="submit">Sign in</button>
    </form>
</div>

<?php include 'inc/footer.php'; ?>