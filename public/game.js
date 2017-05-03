const apiURL = "http://glacial-hollows-48767.herokuapp.com/"

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var score = 0; // + currentUserScore.value;
//console.log('top ', currentScore);
var ballRadius = 10;

var x = canvas.width/2; //green
var y = canvas.height-30; //green/left

var dx = 6; //blue
var dy = -6; //blue/middle

var dbx = 10; //green
var dby = -10; //green

var dbbx = 5; //red
var dbby = -5; //red/right

//var aquaX = 10; //aqua
//var aquaY = -10; //aqua

var xb = canvas.width/3; 
var yb = canvas.height-30;

var xz = canvas.width/1.5; //red
var yz = canvas.height-30; //red

//var xa = canvas.width/1.3; //aqua
//var ya = canvas.height-30; //aqua

var paddleHeight = 10;
var paddleWidth = 25;

var paddleX = (canvas.width-paddleWidth);
var paddleY = (canvas.height-paddleHeight);

var rightPressed = false;
var leftPressed = false;

var brickHeight = 100;
var brickWidth = 45;
var brickX = (canvas.width-brickWidth)/480;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("touchstart", touchDownHandler, false);
document.addEventListener("touchend", touchUpHandler, false);

function keyDownHandler(e) {
  if(e.keyCode == 39) {
    rightPressed = true;
  } else if(e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if(e.keyCode == 39) {
    rightPressed = false;
  } else if(e.keyCode == 37) {
    leftPressed = false;
  }
}

function touchDownHandler(e) {
  if (!e) {
    var e = event;
  }
  e.preventDefault();
  var x = e.targetTouches[0].pageX;
  if (x < canvas.width / 2) {
    leftPressed = true;
  } else {
    rightPressed = true;
  }
}

function touchUpHandler(e) {
  leftPressed = false;
  rightPressed = false;
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#18BC9C";
  ctx.fillText("Score: "+score, 8, 20);
}

function drawBall(ballRadius , color , xa,ya) {
  ctx.beginPath();
  ctx.arc(xa, ya, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
}

function drawBrick() {
  ctx.beginPath();
  ctx.rect(brickX, canvas.height-brickHeight, brickWidth, brickHeight);
  ctx.fillStyle = 'grey';
  ctx.fill();
  ctx.closePath();
}

function collisionDetection() {
  if(paddleX > brickX && paddleX < brickX +brickWidth) {
    if(brickX == canvas.width-brickWidth) {
      brickX= (canvas.width-brickWidth)/480;
    } else {
      brickX= (canvas.width-brickWidth);
    //}
    //if (currentUserScore === Number) {
      //console.log('currentUserScore within if statement: ', loadScore)
      //score = loadScore + score;
      //score++;
    //} else {
    }
    score++;
  }
}


function gameOver(){
  
    var data = {
    name: name,
    score: score,
}
      $.ajax({
        url : apiURL + "/eraseCurrentScore",
        type: "PATCH",
        data : data,
        success: function(response) {

        }
      });

        $.ajax({
            url : apiURL + "/existing",
            type: "GET",
            data : data,
            success: function(data) {
              console.log('data.user.score: ', data.user.score); //gets here
                  var currentHighScore = data.user.score;
                  console.log('currentHighScore: ', currentHighScore);  
                if (currentHighScore < score) {
                  $.ajax({
                    url : apiURL + "/users/" + score, // heroku url
                    type: "PATCH",
                    data : data,
                    success: function(response) {

                    }
                  })
                }
                }
              })
            

  var msg = {
    "messageType": "SCORE",
    "score": score
  };

  window.parent.postMessage(msg, "*");
  alert("GAME OVER! Your score was " + score);
  document.location.reload();
}


var message =  {
  messageType: "SETTING",
  options: {
  "width": 500,
  "height": 450
}
};



/*****
CANVAS
*****/

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall(ballRadius , 'red', x, y);
  drawBall(ballRadius, 'blue', xb, yb);
  drawBall(ballRadius, 'green', xz, yz);
  //drawBall(ballRadius, 'aqua', xa, yz);
  drawPaddle();
  drawBrick();
  drawScore();
  collisionDetection();

                /******************
                BOUNCING GREEN BALL
                ******************/

  if(y + dy < ballRadius) {
      dy= -dy;
   } else if (y + dy > (canvas.height-ballRadius)) {
      //checking if the ball hits the paddle
      if(x > paddleX && x < paddleX + paddleWidth) {
        gameOver();
      } else {
        dy = -dy;
      }
    }

                /*****************
                BOUNCING BLUE BALL
                *****************/

  if(yb +dby < ballRadius) {
    dby= -dby;
  } else if (yb + dby > (canvas.height-ballRadius)) {
      //checking if the ball hits the paddle
      if(xb > paddleX && xb < paddleX + paddleWidth ) {
        gameOver();
      } else {
        dby = -dby;
      }
    }

                /*******************
                BOUNCING YELLOW BALL
                *******************/
  
  if(yz +dbby < ballRadius) {
    dbby= -dbby;
  } else if (yz + dbby > (canvas.height-ballRadius)) {
      //checking if the yellow ball hits the paddle
      if(xz > paddleX && xz < paddleX + paddleWidth ) {
        gameOver();
      } else {
        dbby = -dbby;
      }
    }

                /*******************************
                BOUNCING AQUA BALL (COMING SOON)
                ********************************
if(ya +aquaY < ballRadius)
{
  aquaY= -aquaY;
}
else if(ya + aquaY > (canvas.height-ballRadius)) {
    //checking if the aqua ball hits the paddle
     if(xa > paddleX && xa < paddleX + paddleWidth ) {
        gameover();
       }
       else
       {
       aquaY = -aquaY;
       }
}
*/

                /**************
                PADDLE MOVEMENT
                **************/

  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  //moving the ball up and down
    y += dy;
    yb +=dby;
    yz +=dbby;
    //ya +=aquaY;
}
setInterval(draw, 10);

var currentUserScore = 0

// AJAX
// get and display high scores

$(document).ready(function(){
  var data = {
    name: name,
    score: score
}
        $.ajax({
            url : apiURL + "/scores", // heroku url
            type: "GET",
            data : data,
            success: function(data) {
              for(var i=0; i<data.length; i++) {
                if (data[i].score !== undefined) {
                var html = "<tr><td class='table-data-score'>" + data[i].score + " </td><td class='table-data-name'>" + data[i].username + '</td></tr>';
                $('.scores-table').append(html);
            }
          }
          }
        })
});

$(document).ready(function() {
  $('.logout-button').show();
  //$('#myCanvas').hide();
})

//$('.box').on('click', function(event) {
  //$('.box').hide();
  //$('#myCanvas').show();
  //draw();
//}

//existing user login form

$('.login-form').on('submit', function(event) {
    event.preventDefault()
    window.location="/game.html"
    var username = event.target.Username.value
    var password = event.target.Password.value
  

    var user = {
        username: username,
        password: password,
    }

    $.ajax({
        url : apiURL + "/existing", // heroku url
        type: "GET",
        data : user,
        success: function(response) {
          //window.location="/game.html"
            var html = "<p>Login attempt successful</p>";
            var username = response.user.username
            var html2 = "<p>Logged in as " + username + "</p>";
            $('.random').append(html);
            $('.random').append(html2);
            $('.new-user-form').hide();
            $('.login-form').hide();
            $('.logout-button').show();
    }

})
})

//this will show who is logged in on page load

$(document).ready(function(response) {
    $.ajax({
      url : apiURL + "/existing", // heroku url
      type: "GET",
      success: function(response) {
        console.log('response: ', response);
          var username = response.user.username
          var savedScore = response.user.currentScore
          var html = "<p>Logged in as " + username + "</p>";
          $('.append-logout').append(html);
          $('.logout-button').show();
          $('.new-user-form').hide();
          //$('.saved-score-box-form').val(savedScore);
          //$('.login-form').hide();
          document.getElementById("myLink").innerHTML=savedScore;

  }
})
})
/*
window.onload = function() {
       //when the document is finished loading, replace everything
       //between the <a ...> </a> tags with the value of splitText
   document.getElementById("myLink").innerHTML=6;
}*/

//can save score without losing progress, or it will save on gameOver

$('.save-score-button').on('submit', function(event) {
  event.preventDefault();

    var data = {
    name: name,
    score: score
}

      $.ajax({
        url : apiURL + "/currentScore/" + score, // heroku url
        type: "PATCH",
        data : data,
        success: function(response) {
          var savedScore = response.currentScore
          var highScore = response.score
          //var html = "<p>Your current saved score is " + savedScore + ". This will be added to the leaderboards, and you can continue playing from that score by clicking load!</p>";
          //$('.random').append(html);
          //$('.saved-score-box').append(savedScore);
          document.getElementById("myLink").innerHTML=savedScore;
          if (savedScore > highScore) {
                  $.ajax({
                    url : apiURL + "/users/" + score, // heroku url
                    type: "PATCH",
                    data : data,
                    success: function(response) {
                      //window.location.reload();
                    //var savedScore = response.currentScore
                    //$('.saved-score-box').append(savedScore);
                    //$('.saved-score-box').value(savedScore);

        }
      });       $.ajax({
        url : apiURL + "/currentScore/" + score, // heroku url
        type: "PATCH",
        data : data,
        success: function(response) {
          var savedScore = response.currentScore
          var highScore = response.score
          //var html = "<p>Your current saved score is " + savedScore + ". This will be added to the leaderboards, and you can continue playing from that score by clicking load!</p>";
          //$('.random').append(html);
          //$('.saved-score-box').append(savedScore);
        }
      });// 
    }; document.location.reload()
  }
});
});

//var loadScore = 0;
// this will allow a user to resume a session with the score they saved it at
// add alert - warn them that they will lose current progress.

$('.load-score-button').on('submit', function(event) {
  event.preventDefault();
      var data = {
        name: name,
        score: score
    }

    $.ajax({
      url : apiURL + "/loadScore",
      type: "GET",
      data : data,
      success: function(response) {
        score = response.currentScore
        drawScore();
  }
})
})

//logout

$('.logout-button').on('click', function(event) {
  $.ajax({
        url : apiURL + "/logout/",
        type: "GET",
        success: function(response) {
          if (response.loggedOut) {
            window.location="/"
          }
  }
})
});

//window.location=index.html
