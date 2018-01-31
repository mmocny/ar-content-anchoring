const express = require('express');
const app = express();

app.get("/", function(req, res) {
  console.log("hello world");
  res.send(`
    <html>
      <head>
        <style>
           body {
            perspective: 200px;
           }

           .cube {
             position: absolute;
             top: 50%;
             left: 50%;
             text-align: center;
             font-size: 4em;
             width: 16em;
             margin: 1.5em auto;
             transform-style: preserve-3d;
             /* transform: rotateX(90deg); */
             transform: rotateX(0deg) translateY(-4em) translateX(-8em) rotateY(0deg)
           }

           .side {
             position: absolute;
             width: 4em;
             height: 4em;
  
            /*
             background: rgba(255, 99, 71, .6);
            */
             border: 1px dashed rgba(0, 0, 0, .5);
  
             color: white; 
             text-align: center;
             line-height: 2em;
           }

           .front  { transform:                  translateZ(2em); width: 16em; }
           .top    { transform: rotateX( 90deg)  translateZ(2em); width: 16em; height: 4em; }
           .right  { transform: rotateY( 90deg)  translateZ(14em); width: 4em; }
           .left   { transform: rotateY(-90deg)  translateZ(2em); width: 4em; }
           .bottom { transform: rotateX(-90deg)  translateZ(2em); width: 16em; height: 4em; }
           .back   { transform: rotateY(-180deg) translateZ(2em); width: 16em; }

          .map {
             transform: rotateZ(90deg) rotateY(-70deg) translate(-50%);
             position: absolute;
             width: 100%;
             top: -15%;
          }

          .back, .bottom {
             background-size: cover;
             background-repeat: no-repeat;
             background-position: center center; 
             opacity: 0.6;
             filter: alpha(opacity=60);
          }

        </style>
      </head>
      <body>

           <div id="arrow" class="cube">
             <div class="side  front"></div>
             <div class="side   back" id="back"></div>
             <div class="side  right" id="right"></div>
             <div class="side   left" id="left"></div>
             <div class="side    top"></div>
             <div class="side bottom" id="bottom"></div>
           </div>

           <br><textarea id="debug" rows="2" cols="120"></textarea>

        <!--


        <div id="arrow2" class="arrow"></div>

        -->

        <script>

           function debug(str) {
             document.getElementById("debug").value = "[" +  new Date() + "] " + str;
           }

           function background(user, flag) {
             // document.getElementById("map").src = 
             let back =
             "https://maps.googleapis.com/maps/api/streetview?" +
             "size=400x400" +
             "&location=" + user.lat + "," + user.lon +
             "&fov=90&pitch=10" +
             "&key=AIzaSyBvQ4O0ju12WpYVKO-SY82-ntAicgXLf8o";
             // console.log(back);

             // document.getElementById("back").style.backgroundImage =
             //  "url('" + back + "&heading=" + user.heading + "')";
             // document.getElementById("left").style.backgroundImage = 
             //   "url('" + back + "&heading=" + (heading - 90) + "')";
             // document.getElementById("right").style.backgroundImage = 
             //   "url('" + back + "&heading=" + (heading + 90) + "')";

             let bottom = "https://maps.googleapis.com/maps/api/staticmap?" +
             "&zoom=19&size=600x600&sensor=false" +
              // "&maptype=satellite" +
             "&center=" + user.lat + "," + user.lon +
             "&markers=color:red%7Clabel:A%7C" + user.lat + "," + user.lon +
             "&markers=color:blue%7Clabel:B%7C" + flag.lat + "," + flag.lon;
              document.getElementById("bottom").style.backgroundImage = "url('" + bottom + "')";
           }

           let user = {lat: 37.4183027, lon: -122.0863113, heading: 235};
           let flag = {lat: 37.4183027, lon: -122.0864113};
           background(user, flag);

           navigator.geolocation.getCurrentPosition(function(position) {
               //               return;
               // console.log(position);
               debug("new position: " + position.coords.latitude + ", " + position.coords.longitude);
               user.lat = position.coords.latitude;
               user.lon = position.coords.longitude;
               background(user, flag);
             });

             navigator.geolocation.watchPosition(function(position) {
               // console.log(position);
               debug("new position: " + position.coords.latitude + ", " + position.coords.longitude);
               user.lat = position.coords.latitude;
               user.lon = position.coords.longitude;
               background(user, flag);
             });

             // document.body.webkitRequestFullscreen();
             window.addEventListener("deviceorientation", (e) => {
               debug("new orientation");
               user.heading = e.beta;
               // return;
               // background(user, flag);
               
               // debug(e.gamma * 4);
               document.getElementById("arrow").style.transform = 
               "rotateX(" + (180 + e.gamma * 4) + "deg)" +
               "translateY(-4em)" +
               "translateX(-8em)" +
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
