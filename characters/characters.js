let hero1 = document.getElementById("hero1");
var hero;
hero1Click = function () {
  hero = 1;
  localStorage.setItem("hero", hero);
};
hero1.addEventListener("click", hero1Click);
