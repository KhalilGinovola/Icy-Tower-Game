function updateScores() {
  let currentScores = [];
  for (var i = 0; i < 5; i++) {
    var user = localStorage.getItem("username" + i);
    var score = parseInt(localStorage.getItem("userScore" + i));
    if (!score) {
      score = 0;
    }
    currentScores.push({ name: user, numb: score });
  }
  var currentScore = parseInt(localStorage.getItem("currentScore"));
  var currentUser = localStorage.getItem("currentUser");
  var found = false;
  var setArr = [];
  i = 0;
  while (i != 5) {
    if (currentScore > currentScores[i]["numb"] && found == false) {
      found = true;
      setArr.push({ name: currentUser, numb: currentScore });
    } else {
      if (
        currentScore == currentScores[i]["numb"] &&
        currentUser == currentScores[i]["name"]
      ) {
        i++;
        continue;
      } else {
        setArr.push(currentScores[i]);
        i++;
      }
    }
  }
  for (var i = 0; i < 5; i++) {
    localStorage.setItem("username" + i, setArr[i]["name"]);
    localStorage.setItem("userScore" + i, setArr[i]["numb"]);
  }
  for (var i = 0; i < 5; i++) {
    localStorage.getItem("username" + i), localStorage.getItem("userScore" + i);
  }
}
updateScores();
