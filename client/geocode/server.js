const express = require('express');
const app = express();

app.get("/", function(req, res) {
  console.log("hello world");
  res.send(`
    <html>
      <head>
        <style>
           body {
            perspective: 800px;
           }
           .arrow {
            width: 200px;
            height: 200px;
            margin: 100px;
            color: white;
            background-image: url(https://www.w3.org/html/logo/downloads/HTML5_Badge_512.png);
            background-size: contain;
           }

           .cube {
             position: absolute;
             top: 50%;
             left: 50%;
             text-align: center;
             font-size: 4em;
             width: 2em;
             margin: 1.5em auto;
             transform-style: preserve-3d;
             transform: rotateX(90deg) rotateY(10deg);
           }

           .side {
             position: absolute;
             width: 2em;
             height: 2em;
  
             background: rgba(255, 99, 71, .6);
             border: 1px solid rgba(0, 0, 0, .5);
  
             color: white; 
             text-align: center;
             line-height: 2em;
           }

          .front  { transform:                  translateZ(1em); }
          .top    { transform: rotateX( 90deg)  translateZ(1em); }
          .right  { transform: rotateY( 90deg)  translateZ(1em); }
          .left   { transform: rotateY(-90deg)  translateZ(1em); }
          .bottom { transform: rotateX(-90deg)  translateZ(1em); }
          .back   { transform: rotateY(-180deg) translateZ(1em); }

          .map {
             transform: rotateZ(90deg) rotateY(-70deg) translate(-50%);
             position: absolute;
             width: 100%;
             top: -15%;
          }

            .back, .bottom {
             opacity: 0.6;
             filter: alpha(opacity=60);
             background-size: contain;
          }

        </style>
      </head>
      <body>

           <div id="arrow" class="cube">
             <div class="side  front">1</div>
             <div class="side   back" id="back">6</div>
             <div class="side  right">4</div>
             <div class="side   left">3</div>
             <div class="side    top">5</div>
             <div class="side bottom" id="bottom">2</div>
           </div>

        <!--


        <div id="arrow2" class="arrow"></div>

        <br><textarea id="debug" rows="2" cols="120"></textarea>
        -->

        <script>

           function debug(str) { document.getElementById("debug").value = str; }

            let lat = 37.4183027;
            let lon = -122.0863113;

            let flag = {lat: 37.4183027, lon: -122.0864113};
            
            // document.getElementById("map").src = 
            let back =
            "https://maps.googleapis.com/maps/api/streetview?" +
            "size=400x400" +
            "&location=" + lat + "," + lon +
            "&fov=90&heading=235&pitch=10" +
            "&key=AIzaSyBvQ4O0ju12WpYVKO-SY82-ntAicgXLf8o";

            document.getElementById("back").style.backgroundImage = "url('" + back + "')";

            let bottom = "https://maps.googleapis.com/maps/api/staticmap?" +
            "&zoom=20&size=600x600&sensor=false&maptype=satellite" +
            "&center=" + lat + "," + lon +
            "&markers=color:red%7Clabel:A%7C" + lat + "," + lon +
            "&markers=color:blue%7Clabel:B%7C" + flag.lat + "," + flag.lon;

            document.getElementById("bottom").style.backgroundImage = "url('" + bottom + "')";

             navigator.geolocation.getCurrentPosition(function(position) {
               return;
               // console.log(position);
               // debug("First: " + position.coords.latitude + ", " + position.coords.longitude);

               let lat = position.coords.latitude;
               let lon = position.coords.longitude;
             });

             //navigator.geolocation.watchPosition(function(position) {
               // console.log(position);
             //  debug(position.coords.latitude + ", " + position.coords.longitude);
             //});

             window.addEventListener("deviceorientation", (e) => {
               // debug(e.gamma * 4);
               document.getElementById("arrow").style.transform = 
               "rotateX(" + (180 + e.gamma * 4) + "deg)" +
               "translateY(-1em)" +
               "rotateY(" + (- e.beta * 4) + "deg)";
          
               //"rotateZ(" + e.alpha + "deg)" +
               //"rotateY(" + e.beta + "deg)" +
               //"rotateX(" + e.gamma + "deg)";
              });

             let a0 = 0;

             window.addEventListener("devicemotion", (e) => {
               let time = e.interval;
               let a = e.accelerationIncludingGravity.x;

               a0 += a;

               // document.getElementById("debug").value = a0;

               // document.getElementById("arrow").style.transform = 
               //   "rotateZ(" + a0 + "deg)";


               ///document.getElementById("debug").style.backgroundColor = "#" + ((a * 100).toString(16));
               // console.log((a * 100).toString(16));
             }, false);
        </script>
      </body>
    </html>
  `);
});

app.listen(8080);
