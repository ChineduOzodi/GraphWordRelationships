var canvas;
var inputValue;
var wordList = [];
var wordRelationshipData = {};
var wordObjectList = [];
var lineObjectsList = [];

function setup() {
    canvas = createCanvas(1200, 800);
    canvas.id('sketch');
    background(255);
    fill(100, 200, 100);
    ellipse(width / 2, height / 2, 20, 20);
    inputValue = createInput("a b c");
    calculateButton = createButton('Calculate');
    calculateButton.mousePressed(createData);

}

function createData() {

    //Reset Data

    wordList = [];
    wordRelationshipData = {};

    // Create the data in the object
    wordList = str(inputValue.value()).split(" ");
    for (var i = 0; i < wordList.length; i++) {
        // Check and add new words to object
        if (!(wordList[i] in wordRelationshipData)) {
            wordRelationshipData[wordList[i]] = [];
        }
        //add words to the left of word to the words array
        if (i > 0) {
            //Check to make sure the word isn't itself 
            if (wordList[i] != wordList[i -1]){
                wordRelationshipData[wordList[i]].push(wordList[i - 1]);

                lineObjectsList.push(new wordLine());
                var newLine = lineObjectsList[lineObjectsList.length - 1];
                newLine.begin_word = wordList[i];
                newLine.end_word = wordList[i - 1];
            }
            
        }
        //add words to the right of word to the words array
        if (i < wordList.length - 1) {
            if (wordList[i] != wordList[i + 1]){
                wordRelationshipData[wordList[i]].push(wordList[i + 1]);
    
                lineObjectsList.push(new wordLine());
                var newLine = lineObjectsList[lineObjectsList.length - 1];
                newLine.begin_word = wordList[i];
                newLine.end_word = wordList[i + 1];
            }
        }
    }

    setWordGraph();
}

function setWordGraph() {
    //Reset data
    wordObjectList = [];

    //Create objects in lise
    for (var i = 0; i < wordList.length; i++) {
        //add words to the left of word to the words array
        if (wordObjectList.length < 1 || wordObjectList.findIndex((x) => x.name == wordList[i]) < 0) {
            wordObjectList.push(new word());
            var newWord = wordObjectList[wordObjectList.length - 1];
            newWord.x = random(0, width);
            newWord.y = random(0, height);
            newWord.name = wordList[i];
            newWord.size = wordRelationshipData[wordList[i]].length * 1;
        }

    }
}

function word() {
    this.x = 0;
    this.y = 0;
    this.size = 0;
    this.name = "";

    this.display = function () {
        fill(200, 200, 100, 255);
        ellipse(this.x, this.y, this.size, this.size);
        fill(50);
        text(this.name, this.x - 20, this.y, 20, 20); // Text wraps within text box
    }

}

function wordLine() {
    this.begin_word = "";
    this.end_word = "";
    this.length = 50;

    this.pushPull = function () {
        //pull/push end word object towards desired length
        var beginWord = wordObjectList.find((x) => x.name == this.begin_word);
        var endWord = wordObjectList.find((x) => x.name == this.end_word);
        var currentLength = dist(beginWord.x, beginWord.y, endWord.x, endWord.y);
        var transX = beginWord.x - endWord.x;
        var transY = beginWord.y - endWord.y;
        var biggesTrans = abs(transX);
        var speed = .1;
        this.length = beginWord.size + endWord.size + 250;
        if (abs(transY) > biggesTrans){
            biggesTrans = abs(transY);
        }
        if (currentLength > this.length) {
            //Pull object
            //  print(beginWord.name + ' l: ' + currentLength+ ' pulling ' + endWord.name);
            endWord.x += transX / biggesTrans * speed;
            endWord.y += transY / biggesTrans * speed;
        }
        else if (currentLength < this.length) {
            //Pushs object
            // print(beginWord.name + ' l: ' + currentLength + ' pushing ' + endWord.name);
            endWord.x -= transX / biggesTrans * speed;
            endWord.y -= transY / biggesTrans *speed;
        }
    }

    this.display = function () {
        stroke(50, 50, 50, 20);
        var beginWord = wordObjectList.find((x) => x.name == this.begin_word);
        var endWord = wordObjectList.find((x) => x.name == this.end_word);
        // print(beginWord);
        if (beginWord && endWord) {
            line(beginWord.x, beginWord.y, endWord.x, endWord.y);
        }

    }
}

function draw() {
    background(255);
    // print(wordList);
    for (var i = 0; i < wordObjectList.length; i++) {
        wordObjectList[i].display();
    }

    for (var i = 0; i < lineObjectsList.length; i++) {
        lineObjectsList[i].display();
    }

    for (var i = 0; i < lineObjectsList.length; i++) {
        lineObjectsList[i].pushPull();
    }
}

