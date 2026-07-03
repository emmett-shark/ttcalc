let scores = [];
let tt = 0;

document.getElementById("result").style.visibility = "hidden";
loadData();

document.getElementById("search").addEventListener("click", async (event) => {
  loadData(event);
});

async function loadData(event) {
  event?.preventDefault();
  let id = document.getElementById("profile-id").value;
  if (!id || !!isNaN(id)) { // if not numeric
    return;
  }
  document.getElementById("tt").innerHTML = "⏳";
  document.getElementById("current-id").innerHTML = id;
  document.getElementById("result").style.visibility = "hidden";
  try {
    let response = await fetch(`https://toottally.com/api/profile/${id}/best_scores/?page_size=300`);
    let data = await response.json();
    scores = data.results;
    tt = getTT(scores.map((x) => x.tt));
    document.getElementById("tt").innerHTML = tt.toFixed(5);
    document.getElementById("result").style.visibility = "visible";
    calculate();
  } catch(error) {
    console.log(error);
    document.getElementById("tt").innerHTML = "N/A";
  }
}

function calculate() {
  let raw = Number(document.getElementById("score").value);
  let chartId = Number(document.getElementById("chart-id").value);

  document.getElementById("raw").innerHTML = raw;
  let scoreIndex =  scores.findIndex((x) => x.song_id === chartId);
  let newTT = 0;
  if (scoreIndex >= 0) {
    document.getElementById("song-text").innerHTML = ` for ${scores[scoreIndex].song_name}`;
    newTT = replacedScoreTotalTT(raw, scoreIndex);
  } else {
    document.getElementById("song-text").innerHTML = "";
    newTT = newScoreTotalTT(raw);
  }
  document.getElementById("weighted-tt").innerHTML = (newTT - tt).toFixed(5);
  document.getElementById("new-tt").innerHTML = newTT.toFixed(5);
}

function replacedScoreTotalTT(score, scoreIndex) {
  if (score <= scores[scoreIndex].tt) return tt;
  let copiedNumbers = scores.toSpliced().map((x) => x.tt);
  copiedNumbers[scoreIndex] = score;
  copiedNumbers.sort((a, b) => b - a);
  return getTT(copiedNumbers);
}

function getIndex(score) {
  for (let i = 0; i < scores.length; i++) {
    if (scores[i].tt < score) {
      return i;
    }
  }
  return scores.length;
}

function newScoreTotalTT(score) {
  let copy = scores.toSpliced();
  let i = getIndex(score, scores);
  if (i >= copy.length) {
    return tt;
  }
  let copiedNumbers = copy.map((x) => x.tt);
  copiedNumbers.splice(i, 0, score);
  if (copiedNumbers.length > 300) copiedNumbers.pop();
  return getTT(copiedNumbers);
}

function getTT(arr) {
  return arr.reduce((a, b, i) => a + b*(0.965**i));
}
