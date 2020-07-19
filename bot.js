const DIRECTIONS = ["left", "up", "right", "down"]
const NUM_TRAINING_ROUNDS = 100
const NUM_MOVES = 100
const NUM_BOTS = 100


var thought_processes = []
var round = 0

function startBot(tp) {
    let currGame = gameInstance
    currGame.start()
    let bot = new Bot(currGame, tp)
    for(var i = 0; i < NUM_MOVES; i++) {
        currGame.move(bot.findNextMove())
    }
    return currGame.highestTile
}

function trainBot() {
    let currGame = gameInstance
    var results = JSON.parse(localStorage.getItem("results")) || []
    results.forEach(res => {
        this.thought_processes.push(res.tp)
    })
    results = []

    for(var i = 0; i < NUM_TRAINING_ROUNDS; i++) {
        round = i
        results = trainingRound(currGame)
        results.sort( function(a, b) { return a.score < b.score})
        results.splice(results.length / 2, results.length / 2)
        results.forEach(res => {
            this.thought_processes.push(res.tp)
        })
    }

    localStorage.setItem("results", JSON.stringify(results))
    console.log(results)
}

function trainingRound(currGame) {
    var results = []
    for(var i = 0; i < NUM_BOTS; i++) {
        let tp = changeThoughtProcess(getRandomThoughtProcess(currGame.rows, currGame.cols))
        results.push({tp: tp, score: startBot(tp)})
    }
    return results
}

function changeThoughtProcess(tp) {
    var changedTp = []
    tp.forEach(t => {
        var newT = []
        t.forEach(p => {
            newT.push((p * ((round + 11) * 2) + Math.random() * round + 1) / (((round + 11) * 2) + round + 1))
        })
        changedTp.push(newT)
    })
    return changedTp
}

function getRandomThoughtProcess(rows, cols) {
    if(thought_processes.length = []) {
        return generateRandomThoughtProcess(rows, cols)
    } else {
        return thought_processes[getRandomArbitrary(0, thought_processes.length-1)]
    }   
}

function generateRandomThoughtProcess(rows, cols) {
    var o = []
    for(var i = 0; i < rows; i++) {
        o[i] = []
        for(var j = 0; j < cols; j++) {
            o[i][j] = Math.random()
        }
    }
    return o
}

var Bot = function(game, thoughtProcess) {

    this.game = game
    this.board = game.plan
    this.thoughtProcess = thoughtProcess

    this.findNextMove = function() {
        var move = this.calculateMove(this.board, this.thoughtProcess)

        if(move < 0.25) { return DIRECTIONS[0] }
        else if(move < 0.5) { return DIRECTIONS[1] }
        else if(move < 0.75) { return DIRECTIONS[2] }
        else { return DIRECTIONS[3] }
    }

    this.calculateMove = function(plan, thoughtProcess) {
        let o = 0
        for(var i = 0; i < plan.length; i++) {
            for(var j = 0; j < plan[i].length; j++) {
                o += plan[i][j] * thoughtProcess[i][j]
            }
        }
        let res = (1/(1 + Math.exp(o)))
        //console.log(res)
        return res
    }

}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * max) + min  
}