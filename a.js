let scores = [];

document.getElementById("result").style.visibility = "hidden";
loadData();

document.getElementById("update").addEventListener("click", async (event) => {
  loadData(event);
});

async function loadData(event) {
  event?.preventDefault();
  let id = document.getElementById("profile-id").value;
  if (!id || !!isNaN(id)) {
    return;
  }
  document.getElementById("tt").innerHTML = "⏳";
  document.getElementById("current-id").innerHTML = id;
  document.getElementById("result").style.visibility = "hidden";
  try {
    let response = await fetch(`https://toottally.com/api/profile/${id}/best_scores/?page_size=300`);
    let data = await response.json();
    scores = data.results.map((x) => x.tt);
    document.getElementById("tt").innerHTML = getTT(scores).toFixed(5);
    document.getElementById("result").style.visibility = "visible";
    calculate();
  } catch(error) {
    console.log(error);
    document.getElementById("tt").innerHTML = "N/A";
  }
}

function calculate() {
  let raw = Number(document.getElementById("score").value);
  document.getElementById("raw").innerHTML = raw;
  document.getElementById("weighted").innerHTML = getWeighted(raw, scores).toFixed(5);
}

function getIndex(score, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < score) {
      return i;
    }
  }
  return arr.length;
}

function getWeighted(score, arr) {
  let copy = arr.toSpliced();
  let i = getIndex(score, arr);
  if (i >= copy.length) {
    return 0;
  }
  copy.splice(i, 0, score);
  if (copy.length > 300) copy.pop();
  return getTT(copy) - getTT(arr);
}

function getTT(arr) {
  return arr.reduce((a, b, i) => a + b*(0.965**i));
}
