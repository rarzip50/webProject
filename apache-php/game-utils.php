<?php
    function setGameLogFIle($gameLog) {
        var_dump($gameLog);
        file_put_contents("game-log.json", json_encode($gameLog));
    }

    function readGameLogFile() {
        if (file_exists("game-log.json")) {
            return json_decode(file_get_contents("game-log.json"), true);
        }
    }

?>