var canvas;
var inputValue;
var wordList = [];
var wordRelationshipData = {};
var wordObjectList = [];
var lineObjectsList = [];
var showName = true;
var stopwords = ['all', 'just', 'being', 'over', 'both', 'through', 'yourselves', 'its', 'before', 'herself', 'had', 'should', 'to', 'only', 'under', 'ours', 'has', 'do', 'them', 'his', 'very', 'they', 'not', 'during', 'now', 'him', 'nor', 'did', 'this', 'she', 'each', 'further', 'where', 'few', 'because', 'doing', 'some', 'are', 'our', 'ourselves', 'out', 'what', 'for', 'while', 'does', 'above', 'between', 't', 'be', 'we', 'who', 'were', 'here', 'hers', 'by', 'on', 'about', 'of', 'against', 's', 'or', 'own', 'into', 'yourself', 'down', 'your', 'from', 'her', 'their', 'there', 'been', 'whom', 'too', 'themselves', 'was', 'until', 'more', 'himself', 'that', 'but', 'don', 'with', 'than', 'those', 'he', 'me', 'myself', 'these', 'up', 'will', 'below', 'can', 'theirs', 'my', 'and', 'then', 'is', 'am', 'it', 'an', 'as', 'itself', 'at', 'have', 'in', 'any', 'if', 'again', 'no', 'when', 'same', 'how', 'other', 'which', 'you', 'after', 'most', 'such', 'why', 'a', 'off', 'i', 'yours', 'so', 'the', 'having', 'once'];

function setup() {
    canvas = createCanvas(1200, 800);
    canvas.id('sketch');
    background(255);
    fill(100, 200, 100);
    ellipse(width / 2, height / 2, 20, 20);
    inputValue = createInput("Make fancy scatter and linear plots that update in real time. Display histograms in the vertical and horizontal directions.Add several layers with different properties to the same plot.It works both with linear and logarithmic scales.Automatic axis tick determination.Interactive zooming and panning. Make your data move!Add labels to your points and display them with one click.You can use images to represent your points.Highly customizable. Defaults are nice, but you can tweak almost everything.Processing coding style. If you are used to work with Processing (or p5.js), grafica.js will be very easy.It comes with a good set of examples. Check them live at openprocessing and JSFiddle.It's open source. grafica.js is under the GNU Lesser General Public License. You can find the complete source code here.");
    calculateButton = createButton('Calculate');
    calculateButton.mousePressed(createData);
    showNameButton = createButton("Names")
    showNameButton.mousePressed(showNames);

}

function showNames() {
    showName = !showName;
}

function createData() {

    //Reset Data
    lineObjectsList = [];
    wordList = [];
    wordRelationshipData = {};

    var s = str(inputValue.value());
    var punctuationless = s.replace(/[^\w\s]|_/g, "");
    var finalString = punctuationless.replace(/\s+/g, " ");
    var allWords = str(finalString.toLowerCase()).split(" ");
    wordList = allWords.filter(x => !(stopwords.includes(x) || x.length < 2));

    print(allWords.length + ' - ' + wordList.length);

    // Create the data in the object
    for (var i = 0; i < wordList.length; i++) {
        // Check and add new words to object
        if (!(wordList[i] in wordRelationshipData)) {
            wordRelationshipData[wordList[i]] = [];
        }
        //add words to the left of word to the words array
        if (i > 0) {
            //Check to make sure the word isn't itself 
            if (wordList[i] != wordList[i - 1]) {
                //check to see if word alread added to relationship list
                if (lineObjectsList.find((x) => wordList[i] == x.beginWord && wordList[i - 1] == x.endWord) != undefined) {
                    //increase the line width
                    var oldLine = lineObjectsList.find((x) => wordList[i] == x.beginWord && wordList[i - 1] == x.endWord);
                    oldLine.width += 10;
                }
                else {
                    wordRelationshipData[wordList[i]].push(wordList[i - 1]);

                    lineObjectsList.push(new wordLine());
                    var newLine = lineObjectsList[lineObjectsList.length - 1];
                    newLine.beginWord = wordList[i];
                    newLine.endWord = wordList[i - 1];
                }

            }

        }
        //add words to the right of word to the words array
        if (i < wordList.length - 1) {
            if (wordList[i] != wordList[i + 1]) {
                if (lineObjectsList.find((x) => wordList[i] == x.beginWord && wordList[i + 1] == x.endWord) != undefined) {
                    //increase the line width
                    var oldLine = lineObjectsList.find((x) => wordList[i] == x.beginWord && wordList[i + 1] == x.endWord);
                    oldLine.width += 20;
                }
                else {
                    wordRelationshipData[wordList[i]].push(wordList[i + 1]);

                    lineObjectsList.push(new wordLine());
                    var newLine = lineObjectsList[lineObjectsList.length - 1];
                    newLine.beginWord = wordList[i];
                    newLine.endWord = wordList[i + 1];
                }

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

            var filteredLines = lineObjectsList.filter(x => x.beginWord == newWord.name);
            // print(filteredLines);
            for (b = 0; b < filteredLines.length; b++) {
                newWord.size += filteredLines[b].width * .1;
            }

        }

    }
}

function word() {
    this.x = 0;
    this.y = 0;
    this.velX = 0;
    this.velY = 0;
    this.forceX = 0;
    this.forceY = 0;
    this.size = 0;
    this.name = "";

    this.display = function () {
        stroke(50);
        noStroke();
        fill(0, 0, this.name.length / 20 * 255, 255);
        ellipse(this.x, this.y, this.size, this.size);


        if (this.size / 2 + 5 > 10) {
            strokeWeight(1);
            stroke(255, 255, 255);
        }
        else {
            noStroke();
        }
        fill(0, 0, 0);
        if (showName) {
            textSize(this.size / 1.2 + 5);
            text(this.name, this.x, this.y); // Text wraps within text box
            textAlign(CENTER, CENTER);
        }
    }

    this.move = function () {

        // print('force: ' + this.forceX + ' ' + this.forceY);

        //apply drag force
        if (this.velX < 0) {
            this.forceX += .5 * this.velX * this.velX;
        }
        else {
            this.forceX -= .5 * this.velX * this.velX;
        }

        if (this.velY < 0) {
            this.forceY += .5 * this.velY * this.velY;
        }
        else {
            this.forceY -= .5 * this.velY * this.velY;
        }

        //Gravitational push forces

        for (var i = 0; i < wordObjectList.length; i++) {
            var obj = wordObjectList[i];
            if (obj.name != this.name) {
                var distance = dist(this.x, this.y, obj.x, obj.y);
                var transX = this.x - obj.x;
                var transY = this.y - obj.y;
                var biggesTrans = abs(transX);
                if (abs(transY) > biggesTrans) {
                    biggesTrans = abs(transY);
                }
                var forceChangeX = .1 * (transX / biggesTrans) * this.size * obj.size * this.size * obj.size / (distance * distance);
                var forceChangeY = .1 * (transY / biggesTrans) * this.size * obj.size * this.size * obj.size / (distance * distance);

                this.forceX -= forceChangeX / this.size;
                this.forceY -= forceChangeY / this.size;
            }
        }


        //Set accel Limit
        if (this.forceX > 20) {
            this.forceX = 20;
        }
        if (this.forceX < -20) {
            this.forceX = -20;
        }
        if (this.forceY > 20) {
            this.forceY = 20;
        }
        if (this.forceY < -20) {
            this.forceY = -20;
        }

        // print('new force: ' + this.forceX + ' ' + this.forceY);

        //apply force to velocity; assume 60 frames per second
        this.velX += this.forceX / frameRate();
        this.velY += this.forceY / frameRate();



        //apply movement; assume 60 frames per second
        // print('vel: ' + this.velX + ' ' + this.velY);

        this.x += this.velX / frameRate();
        this.y += this.velY / frameRate();

        //reset force
        this.forceX = 0;
        this.forceY = 0;
        // print('pos: ' + this.x + ' ' + this.x);
    }

}

function wordLine() {
    this.beginWord = "";
    this.endWord = "";
    this.length = 0;
    this.width = 20;
    this.currentLength = 0;

    this.pushPull = function () {
        //pull/push end word object towards desired length
        var beginWord = wordObjectList.find((x) => x.name == this.beginWord);
        var endWord = wordObjectList.find((x) => x.name == this.endWord);
        this.currentLength = dist(beginWord.x, beginWord.y, endWord.x, endWord.y);
        var transX = beginWord.x - endWord.x;
        var transY = beginWord.y - endWord.y;
        var biggesTrans = abs(transX);
        var speed = .5;
        this.length = pow(beginWord.size + endWord.size, 1.5) / 2 + 50;
        if (abs(transY) > biggesTrans) {
            biggesTrans = abs(transY);
        }
        //Pull object
        //  print(beginWord.name + ' l: ' + this.currentLength+ ' pulling ' + endWord.name);
        endWord.forceX += transX / biggesTrans * speed * beginWord.size * (this.currentLength - this.length);
        endWord.forceY += transY / biggesTrans * speed * beginWord.size * (this.currentLength - this.length);
    }

    this.display = function () {
        var beginWord = wordObjectList.find((x) => x.name == this.beginWord);
        var endWord = wordObjectList.find((x) => x.name == this.endWord);
        stroke(abs(this.currentLength - this.length), beginWord.name.length / 20 * 255 - abs(this.currentLength - this.length), 0, this.width * 2);
        strokeWeight(this.width / 10);
        // print(beginWord);
        if (beginWord && endWord) {
            line(beginWord.x, beginWord.y, endWord.x, endWord.y);
        }

    }
}

function draw() {
    background(255);
    // print(wordList);


    for (var i = 0; i < lineObjectsList.length; i++) {
        lineObjectsList[i].display();
    }

    for (var i = 0; i < wordObjectList.length; i++) {
        wordObjectList[i].display();
    }

    for (var i = 0; i < lineObjectsList.length; i++) {
        lineObjectsList[i].pushPull();
    }

    for (var i = 0; i < wordObjectList.length; i++) {
        wordObjectList[i].move();
    }
}

