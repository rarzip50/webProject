<?php include 'inc/header.php'; ?>
<?php
    require('game-utils.php');

    $gameLog = readGameLogFile();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Memory Game</title>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>
    <style>
        .container {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            justify-content: center;
            align-items: center;
        }
       
        * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }
        .side-menu {
            flex-grow: 1;
            display: flex;
            width: 780px;
            box-shadow: 0 2px 10px rgba(0,0,0,.25);
        }
        body {
        height: 100vh;
        display: flex;
            flex-direction: column;
        }

        .memory-game {
        width: 640px;
        height: 640px;
        display: flex;
        flex-wrap: wrap;
        perspective: 1000px;
        
        }

        .box-element {
        
        margin: 5px;
        position: relative;
        transform: scale(1);
        transform-style: preserve-3d;
        transition: transform .5s;
        box-shadow: 1px 1px 1px rgba(0,0,0,.3);

        display: flex;
        align-items: center;
        justify-items: center;
        justify-content: center;
        align-content: center;
        text-align: center;
        font-size: 60px;
        color: white;
        
        }

        .little-board-element{
            width: calc(33% - 10px);
            height: calc(33% - 10px);
        }

        .big-board-element{
            width: calc(25% - 10px);
            height: calc(25% - 10px);
        }

        .box-element:active {
        transform: scale(0.97);
        transition: transform .2s;
        
        }

        .box-element.flip {
        transform: rotateY(180deg);
        }

        .front-face,
        .back-face {
        width: 100%;
        height: 100%;
        padding: 20px;
        position: absolute;
        border-radius: 5px;
        background: #1C7CCC;
        backface-visibility: hidden;
        }
        
        .back-face {
            background: rgb(6, 86, 151);
        }

        .front-face {
        transform: rotateY(180deg);
        }

        .msg-container {
            width: 300px;
            height: 150px;
            border: 2px solid rgb(6, 86, 151);
            
            display: flex;
            align-items: center;
            flex-direction: column;
            align-content: center;
            justify-content: center;
        }

        .hide {
            display: none;
        }

        .play-again-btn {
            padding: 5px 5px;
            width: 120px;
            height: 30px;
            background-color: greenyellow;
            border-radius: 100px;
            font-size: 18px;
        }

        .inline > *{
            display: inline-block;
        }

        #welcomeMenu > *{
            display: block;
            margin-top: 10px;
            margin-bottom: 10px;
        }

        .spacing > *{
            margin-top: 10px;
            margin-bottom: 10px;
            margin-left: 10px;
        }

    </style>
</head>
<body>
    <div class="container">
        <div id="sideMenu" class="side-menu">
            <div class="side-menu-left-container spacing">
                <h2>Memory Game</h1>
                <!-- <div id="welcomeMenu">
                    <input onkeydown="setPlayers(this)" type="text" id="p1Input" placeholder="Player 1">
                    <input onkeydown="setPlayers(this)" type="text" id="p2Input" placeholder="Player 2">
                    <button onclick="setPlayers(this)" class="play-again-btn">Start</button>
                </div> -->
                <!-- <div class="hide" id="gameMenu"> -->
                <div id="gameMenu">
                    <h3>Current Game:</h3>
                    <span class="inline"><h4 style="margin-right: 10px;" class="p1Name"><?php echo $gameLog['firstPlayer']['name'];?></h4> <h4 id="firstPlayerScore">0</h4> - <h4 id="secondPlayerScore">0</h4>
                    <h4 h3 style="margin-left: 10px;" class="p2Name"><?php echo $gameLog['secondPlayer']['name'];?></h4></span>
                    <h3>Games Won:</h3>
                    <span class="inline"><h4 style="margin-right: 10px;" class="p1Name"><?php echo $gameLog['firstPlayer']['name'];?></h4> <h4 id="firstPlayerGamesWon">0</h4> - <h4 id="secondPlayerGamesWon">0</h4>
                    <h4 h3 style="margin-left: 10px;" class="p2Name"><?php echo $gameLog['secondPlayer']['name'];?></h4></span>
                    
                    <div id="boardSizeSelect">
                        <span>Choose Board size:</span>
                        <button id="9BoxesButton" class="play-again-btn">3x3</button>
                        <button id="16BoxesButton" class="play-again-btn">4x4</button>
                    </div>
                </div>
                <button class="play-again-btn" onclick="showHistory()">History</button>
                <select class="hide" id="gamesList"></select>
            </div>
            <div id="msg-container" class="msg-container hide">
                <div class="game-ended-msg">
                    <h1 class="game-ended-title">Game Ended!</h1>
                    <h1 class="game-ennded-winner-name">Winner: <span id="winner-name"></span></h1>
                    <button class="play-again-btn" onclick="playAgain()">Play Again</button>
                </div>
            </div>
        </div>
        <section id="board-game" class="memory-game"></section>
    </div>
</body>
<script>
    //img constants - taken from the internet
    const cards = [
    {
        name: "php",
        img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/php-logo_1.png",
        id: 1,
    },
    {
        name: "css3",
        img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/css3-logo.png",
        id: 2
    },
    {
        name: "html5",
        img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/html5-logo.png",
        id: 3
    },
    {
        name: "jquery",
        img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/jquery-logo.png",
        id: 4
    }, 
    {
        name: "javascript",
        img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/js-logo.png",
        id: 5
    },
    {
        name: "node",
        img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/nodejs-logo.png",
        id: 6
    },
    {
        name: "photoshop",
        img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/photoshop-logo.png",
        id: 7
    },
    {
        name: "python",
        img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/python-logo.png",
        id: 8
    }
]

    //db handling
    if (window.openDatabase) {
        var mydb = openDatabase("games", "0.1", "", 1024 * 1024);
        mydb.transaction(function (t) {
            t.executeSql("CREATE TABLE IF NOT EXISTS games (game STRING)");
    });
    } else {
        alert("WebSQL is not supported by your browser!");
    }

    function updateGameList(transaction, results) {
        var listitems = "";
        var listholder = document.getElementById("gamesList");
        listholder.innerHTML = "";
        var i;
        for (i = 0; i < results.rows.length; i++) {
            var row = results.rows.item(i);
            var game = JSON.parse(row.game)
            var option = document.createElement("option");
            option.text = game.player1Name+": "+game.player1Score+" "+game.player2Name+": "+game.player2Score+" Time: "+game.time;
            listholder.add(option);
        }
    }

    function setPlayers() {
        // $("#gameMenu").removeClass("hide");
        // $("#welcomeMenu").addClass("hide"); 
               
        $(".p1Name")[0].innerText = (gameData.firstPlayer.name);
        $(".p1Name")[1].innerText = (gameData.firstPlayer.name);
    
        $(".p2Name")[0].innerText = (gameData.secondPlayer.name);
        $(".p2Name")[1].innerText = (gameData.secondPlayer.name);
        // console.log(event)
        // if(event.key === 'Enter' || event.type === 'click') {    
        //     gameData.firstPlayer.name = document.getElementById("p1Input").value;
        //     gameData.secondPlayer.name = document.getElementById("p2Input").value;
        //     if(gameData.secondPlayer.name === "" || gameData.firstPlayer.name === ""){
        //         alert("please enter names for 2 players !")
        //     }else{

        //         $("#gameMenu").removeClass("hide");
        //         $("#welcomeMenu").addClass("hide"); 
               
        //         $(".p1Name")[0].innerText = (gameData.firstPlayer.name);
        //         $(".p1Name")[1].innerText = (gameData.firstPlayer.name);
    
        //         $(".p2Name")[0].innerText = (gameData.secondPlayer.name);
        //         $(".p2Name")[1].innerText = (gameData.secondPlayer.name);
        //     }
        // }
    }

    function deleteDb(){
       if(mydb){
            mydb.transaction(function (t) {
                t.executeSql("DROP TABLE games");
            });
       } 
    }

    //for developers only
    //deleteDb()

//function to get the list of games from the database
    function outputGames() {
        //check to ensure the mydb object has been created
        if (mydb) {
            //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
            mydb.transaction(function (t) {
                t.executeSql("SELECT * FROM games", [], updateGameList);
            });
        } else {
            alert("db not found, your browser does not support web sql!");
        }
    }

//function to add the car to the database
    function addGame() {
        if (mydb) {
            //var model = document.getElementById("carmodel").value;
            var game = {
                player1Score: gameData.firstPlayer.setsExposed,
                player1Name: gameData.firstPlayer.name,
                player2Score: gameData.secondPlayer.setsExposed,
                player2Name: gameData.secondPlayer.name,
                time: new Date().toLocaleString()
            };
            
            if (game !== "") {
                mydb.transaction(function (t) {
                    t.executeSql("INSERT INTO games (game) VALUES (?)", [JSON.stringify(game)]);
                    outputGames();
                });
            } else {
                alert("You must enter a make and model!");
            }
        } else {
            alert("db not found, your browser does not support web sql!");
        }
    }

    outputGames();

    
    let memoryBoxes = [];
    let boxElements;
    let openedBoxElem = false;
    let lockBoard = false;
    let firstBox, secondBox;
    let boxCount = 0// = size * size
    let exposedSetsCount = 0

    const  msgContainer = $('#msg-container')

    //all relevant game data
    let gameData = {
        playerTurn: 'firstPlayer',
        firstPlayer: {
            name: "<?php echo $gameLog['firstPlayer']['name']?>",
            setsExposed: 0,
            gamesWon: 0
        },
        secondPlayer: {
            name: "<?php echo $gameLog['secondPlayer']['name']?>",
            setsExposed: 0,
            gamesWon: 0
        }
    }    
    
    // setPlayers()

    function playAgain() {    
        msgContainer.addClass('hide')

        resetCurrentGameData()
        updateDataPanel
        
        unflipAllBoxElements()
        shuffleBoxElements()
        resetBoard()
        enableBoxElements()
    }

    const resetCurrentGameData = () => {

        exposedSetsCount = 0
        gameData.firstPlayer.setsExposed = 0
        gameData.secondPlayer.setsExposed = 0
    }

    const startGame = (size) => {
        $("#boardSizeSelect").css("display", "none")
        //startGame(3)
        boxCount = size*size
        setUpBoxes()
        setUpBoard(size)
        enableBoxElements()
    }

    //create the boxes objects and push them to the json array. size is 3 or 4.
    function setUpBoxes(){
        for (let i = 0; i < boxCount; i++) {
            let box = {};
            box.id = i + 1
            box.content = i < boxCount/2 ? i + 1 : boxCount-i
            box.img = cards[box.content-1].img;
            memoryBoxes.push(box);
        }
    }

    function showHistory(){
        $("#gamesList").removeClass('hide');
    }


    //sets up a board using the boxes array that was created above.
    function setUpBoard(size){
        let board = $('#board-game');

        memoryBoxes.forEach(box => {
            let boxElement = $(document.createElement('div'))
            boxElement.attr('id', box.id)

            if(size === 3)
                boxElement.attr('class', 'box-element little-board-element')
            else
                boxElement.attr('class', 'box-element big-board-element')

            
            boxElement.attr('value', box.content)

            let img = $(document.createElement('img'));
            img.attr('src', box.img);

            
            img.attr('class', 'front-face')
            
            let innerBack = $(document.createElement('h1'))
            
            innerBack.append(document.createTextNode(""))
            

            innerBack.attr('class', 'back-face')

            boxElement.append(img, innerBack)

            board.append(boxElement)
        })

        boxElements = document.querySelectorAll('.box-element');

        shuffleBoxElements();

    }

    const flipBoxElement = function () {
        if (lockBoard) return
        if (this === firstBox) return

        this.classList.add('flip')

        if (!openedBoxElem) {
            openedBoxElem = true
            firstBox = this

            return
        }

        secondBox = this
        checkMatch()
    }

    const checkMatch = async () => {
        const firstBoxValue = firstBox.getAttribute('value')
        const secondBoxValue = secondBox.getAttribute('value')

        if (firstBoxValue === secondBoxValue) {
            gameData[gameData.playerTurn].setsExposed++
            updateDataPanel()
            disableBoxElements()
        } else {
            await unflipBoxElements(firstBox, secondBox)
            resetBoard()
            gameData.playerTurn = gameData.playerTurn === 'firstPlayer' ? 'secondPlayer' : 'firstPlayer'
        }
    }

    const unflipBoxElements = (firstBoxElem, secondBoxElem) => {
        lockBoard = true

        return new Promise(res => {
            setTimeout(() => {
                firstBoxElem.classList.remove('flip')
                secondBoxElem.classList.remove('flip')
                res()
            }, 1500)
        })
    }

    const resetBoard = () => {
        unlockBoard()
        resetCardPicks()
    }

    const unlockBoard = () => {
        lockBoard = false
    }

    const resetCardPicks = () => {
        firstBox = null
        secondBox = null
        openedBoxElem = false
    }

    function updateDataPanel() {
        let firstPlayerScore = $('#firstPlayerScore')
        let secondPlayerScore = $('#secondPlayerScore')
        
        let firstPlayerGamesWon = $('#firstPlayerGamesWon')
        let secondPlayerGamesWon = $('#secondPlayerGamesWon')

        firstPlayerScore.empty()
        firstPlayerScore.append(document.createTextNode(gameData.firstPlayer.setsExposed))
        secondPlayerScore.empty()
        secondPlayerScore.append(document.createTextNode(gameData.secondPlayer.setsExposed))

        firstPlayerGamesWon.empty()
        firstPlayerGamesWon.append(document.createTextNode(gameData.firstPlayer.gamesWon))
        secondPlayerGamesWon.empty()
        secondPlayerGamesWon.append(document.createTextNode(gameData.secondPlayer.gamesWon))
    }

    function  restGameData() {
        gameData.firstPlayer.setsExposed = 0
        gameData.secondPlayer.setsExposed = 0
    }

    function disableBoxElements() {
        firstBox.removeEventListener('click', flipBoxElement);
        secondBox.removeEventListener('click', flipBoxElement);

        exposedSetsCount++;

        exposedSetsCount === (Math.floor(boxCount/2)) ? endGame() : resetBoard()
    }

    function endGame() {
        let winnerName = winner()

        let winnerNameElement = $('#winner-name')
        winnerNameElement.append(document.createTextNode(winnerName))

        let msgContainer = $('#msg-container')
        msgContainer.removeClass('hide')
        addGame();
        updateDataPanel()
    }

    function unflipAllBoxElements() {
        boxElements.forEach(boxElement => {
            boxElement.classList.remove('flip')
        })
    }

    function winner() {
        if (gameData.firstPlayer.setsExposed > gameData.secondPlayer.setsExposed) {
            gameData.firstPlayer.gamesWon++
            return gameData.firstPlayer.name
        } else if (gameData.firstPlayer.setsExposed < gameData.secondPlayer.setsExposed) {
            gameData.secondPlayer.gamesWon++
            return gameData.secondPlayer.name
        } else {
            return 'It\'s a draw!'
        }
    }


    function shuffleBoxElements() {
        boxElements.forEach(boxElem => {
            let randomPos = Math.floor(Math.random() * 12);
            boxElem.style.order = randomPos;
        });
    }

    $('#9BoxesButton').click(()=>{
        startGame(3)
    })

    $('#16BoxesButton').click(()=>{
        startGame(4)
    })

    function enableBoxElements() {
        boxElements.forEach(boxElem => boxElem.addEventListener('click', flipBoxElement));
    }

</script>
</html>

<?php include 'inc/footer.php'; ?>