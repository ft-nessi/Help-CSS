// constants and let's
 const startPageElement = document.querySelector("#start-page");
 const gamePageElement = document.querySelector("#game-page");
 const gameOverPageElement = document.querySelector("#game-over-page");
 console.log(startPageElement);
 console.log("hi");



 function hidePage(name) {
  name.style.display = "none";
 }

 function showPage(name) {
   name.style.display = "flex";
 }



 
 document.getElementById("start-button").onclick = () => {
   hidePage(startPageElement);
   showPage(gamePageElement);
  };
  
  window.addEventListener("onload", () => {
    hidePage(gamePageElement);
    hidePage(gameOverPageElement);
  })
