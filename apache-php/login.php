<?php
    require('game-utils.php');

    // login second player
    $url = 'http://localhost:3000/users/login';
    $data = array(
        'email' => $_POST['email'],
        'password' => $_POST['password']
    );

    $options = array(
        'http' => array(
            'method'  => 'POST',
            'content' => http_build_query($data)
        )
    );
    $context = stream_context_create($options);
    $result = @file_get_contents($url, false, $context);
    
    if ($result === FALSE) {
        // do something
    }
    
    // get auth token from cookie sent by the nodejs server
    $cookies = array();
    foreach ($http_response_header as $hdr) {
        if (preg_match('/^Set-Cookie:\s*([^;]+)/', $hdr, $matches)) {
            parse_str($matches[1], $tmp);
            $cookies += $tmp;
        }
    }
    setCookie('auth_token', $cookies['auth_token']);
    $_COOKIE['auth_token'] = $cookies['auth_token'];

    // set second player to game-log file
    $result = json_decode($result, true);
    $secondPlayer = $result['user'];
    $gameLog = readGameLogFile();
    $gameLog['secondPlayer'] = [
        "id" => $secondPlayer["_id"],
        "name" => $secondPlayer["name"]
    ];
    setGameLogFIle($gameLog);


    header("Location: memoryGame.php");
?>