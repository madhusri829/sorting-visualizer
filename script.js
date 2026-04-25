const DATABASE = {
  bubble: {
    name: "Bubble Sort",
    t: "O(n²)",
    s: "O(1)",
    m: "Bubble Sort compares adjacent elements and swaps them if they are in the wrong order. After each pass, the largest unsorted element moves to the end.",
    c: [
      "for i from 0 to n-1:",
      "  for j from 0 to n-i-2:",
      "    if arr[j] > arr[j+1]:",
      "      swap(arr[j], arr[j+1])"
    ],
    manual: `<b>Technique:</b> Compare adjacent values and swap if needed.<br><br>Largest value bubbles to the end after each pass.`
  },

  selection: {
    name: "Selection Sort",
    t: "O(n²)",
    s: "O(1)",
    m: "Selection Sort finds the minimum element from the unsorted part and places it in the correct position at the front.",
    c: [
      "for i from 0 to n-1:",
      "  minIndex = i",
      "  for j from i+1 to n-1:",
      "    if arr[j] < arr[minIndex]:",
      "      minIndex = j",
      "  swap(arr[i], arr[minIndex])"
    ],
    manual: `<b>Technique:</b> Find the smallest value in the unsorted part and place it first.<br><br>The sorted part grows from left to right.`
  },

  insertion: {
    name: "Insertion Sort",
    t: "O(n²)",
    s: "O(1)",
    m: "Insertion Sort picks one key element and inserts it into the correct position in the sorted left portion.",
    c: [
      "for i from 1 to n-1:",
      "  key = arr[i]",
      "  j = i - 1",
      "  while j >= 0 and arr[j] > key:",
      "    arr[j+1] = arr[j]",
      "    j = j - 1",
      "  arr[j+1] = key"
    ],
    manual: `<b>Technique:</b> Take one key element and insert it into the already sorted left side.<br><br>Larger elements shift to the right.`
  },

  binary: {
    name: "Binary Search",
    t: "O(log n)",
    s: "O(1)",
    m: "Binary Search works only on a sorted array. It repeatedly checks the middle element and eliminates half the search space.",
    c: [
      "low = 0, high = n - 1",
      "while low <= high:",
      "  mid = Math.floor(low + (high - low) / 2)",
      "  if arr[mid] == target: found",
      "  else if arr[mid] < target: low = mid + 1",
      "  else: high = mid - 1"
    ],
    manual: `<b>Technique:</b> Check the middle element.<br><br>If target is smaller, move left. If larger, move right.`
  },

  merge: {
    name: "Merge Sort",
    t: "O(n log n)",
    s: "O(n)",
    m: "Merge Sort uses divide and conquer. It splits the array into halves, sorts each half recursively, and merges them back together.",
    c: [
      "mergeSort(arr, l, r):",
      "  if l >= r: return",
      "  mid = floor((l+r)/2)",
      "  mergeSort(arr, l, mid)",
      "  mergeSort(arr, mid+1, r)",
      "  merge(arr, l, mid, r)"
    ],
    manual: `<b>Technique:</b> Split → Sort → Merge.<br><br>Divide the array into halves, then merge back in sorted order.`
  },

  quick: {
    name: "Quick Sort",
    t: "O(n log n)",
    s: "O(log n)",
    m: "Quick Sort chooses a pivot, places smaller elements on the left and larger elements on the right, then recursively sorts both parts.",
    c: [
      "quickSort(arr, low, high):",
      "  if low < high:",
      "    pivotIndex = partition(arr, low, high)",
      "    quickSort(arr, low, pivotIndex-1)",
      "    quickSort(arr, pivotIndex+1, high)"
    ],
    manual: `<b>Technique:</b> Choose Pivot → Partition → Recurse.<br><br>Smaller values go left of pivot, larger values go right.`
  }
};

let frames = [];
let curIdx = 0;
let timer = null;
let currentAlgo = "bubble";

function openStudio(key) {
  currentAlgo = key;
  document.getElementById("algo-select").value = key;
  document.getElementById("home-view").classList.add("hidden");
  document.getElementById("studio-view").classList.remove("hidden");
  loadTheory();
  initSim();
}

function changeAlgo() {
  currentAlgo = document.getElementById("algo-select").value;
  loadTheory();
  initSim();
}

function loadTheory() {
  const d = DATABASE[currentAlgo];
  document.getElementById("algo-name").innerText = d.name;
  document.getElementById("time-val").innerText = "Time: " + d.t;
  document.getElementById("space-val").innerText = "Space: " + d.s;
  document.getElementById("algo-matter").innerText = d.m;
  document.getElementById("manual-box").innerHTML = d.manual;

  const codeBox = document.getElementById("code-box");
  codeBox.innerHTML = "";
  d.c.forEach((line, i) => {
    const div = document.createElement("div");
    div.className = "code-line";
    div.id = `line-${i}`;
    div.innerText = line;
    codeBox.appendChild(div);
  });

  document.getElementById("binary-target-wrap").style.display =
    currentAlgo === "binary" ? "flex" : "none";
}

function closeStudio() {
  pause();
  document.getElementById("home-view").classList.remove("hidden");
  document.getElementById("studio-view").classList.add("hidden");
}

function randomize() {
  document.getElementById("csv-input").value =
    Array.from({ length: 6 }, () => Math.floor(Math.random() * 15) + 1).join(", ");
  initSim();
}

function initSim() {
  pause();

  const val = document.getElementById("csv-input").value;
  let data = val
    ? val.split(",").map(n => parseInt(n.trim())).filter(n => !isNaN(n))
    : [7, 12, 9, 11, 3];

  if (data.length === 0) data = [7, 12, 9, 11, 3];

  frames = [];
  let d = [...data];

  const add = (a, h, m, type, ln, meta = {}) => {
    frames.push({ arr: [...a], h: [...h], m, type, ln, meta });
  };

  add(d, [], "Start simulation", "idle", 0);

  if (currentAlgo === "bubble") bubbleFrames(d, add);
  else if (currentAlgo === "selection") selectionFrames(d, add);
  else if (currentAlgo === "insertion") insertionFrames(d, add);
  else if (currentAlgo === "binary") binaryFrames(d, add);
  else if (currentAlgo === "merge") mergeSortFrames(d, add);
  else if (currentAlgo === "quick") quickSortFrames(d, add);

  add(d, [], "Simulation complete", "sorted", -1);
  curIdx = 0;
  render(0);
}

function bubbleFrames(d, add) {
  for (let i = 0; i < d.length; i++) {
    for (let j = 0; j < d.length - i - 1; j++) {
      add(d, [j, j + 1], `Comparing ${d[j]} and ${d[j + 1]}`, "compare", 2, {
        labels: { [j]: "j", [j + 1]: "j+1" }
      });

      if (d[j] > d[j + 1]) {
        [d[j], d[j + 1]] = [d[j + 1], d[j]];
        add(d, [j, j + 1], `Swapping ${d[j + 1]} and ${d[j]}`, "swap", 3, {
          labels: { [j]: "swap", [j + 1]: "swap" }
        });
      }
    }
  }
}

function selectionFrames(d, add) {
  for (let i = 0; i < d.length; i++) {
    let min = i;

    add(d, [i], `Start scanning from index ${i}`, "compare", 1, {
      labels: { [i]: "i / min" }
    });

    for (let j = i + 1; j < d.length; j++) {
      add(d, [min, j], `Comparing current min ${d[min]} with ${d[j]}`, "compare", 3, {
        labels: { [min]: "min", [j]: "j" }
      });

      if (d[j] < d[min]) {
        min = j;
        add(d, [min], `New minimum found: ${d[min]}`, "swap", 4, {
          labels: { [min]: "new min" }
        });
      }
    }

    if (min !== i) {
      [d[i], d[min]] = [d[min], d[i]];
      add(d, [i, min], `Placing minimum ${d[i]} at index ${i}`, "swap", 5, {
        labels: { [i]: "i", [min]: "min" }
      });
    }
  }
}

function insertionFrames(d, add) {
  for (let i = 1; i < d.length; i++) {
    let key = d[i];
    let j = i - 1;

    add(d, [i], `Key selected: ${key}`, "compare", 1, {
      labels: { [i]: "key" }
    });

    while (j >= 0 && d[j] > key) {
      add(d, [j, j + 1], `Shifting ${d[j]} right because it is greater than key ${key}`, "compare", 3, {
        labels: { [j]: "j", [j + 1]: "shift" }
      });

      d[j + 1] = d[j];
      add(d, [j + 1], `Shifted ${d[j + 1]} to the right`, "swap", 4, {
        labels: { [j + 1]: "shifted" }
      });

      j--;
    }

    d[j + 1] = key;
    add(d, [j + 1], `Inserted key ${key} at correct position`, "swap", 6, {
      labels: { [j + 1]: "inserted key" }
    });
  }
}

function binaryFrames(d, add) {
  d.sort((a, b) => a - b);
  let target = parseInt(document.getElementById("target-input").value);
  if (isNaN(target)) target = d[0];

  add(d, [], `Sorted array for binary search. Target = ${target}`, "compare", 0);

  let low = 0, high = d.length - 1;

  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);

    add(d, [low, mid, high], `Checking middle value ${d[mid]}`, "compare", 2, {
      labels: { [low]: "low", [mid]: "mid", [high]: "high" }
    });

    if (d[mid] === target) {
      add(d, [mid], `Found ${target} at index ${mid}`, "swap", 3, {
        labels: { [mid]: "found" }
      });
      return;
    } else if (d[mid] < target) {
      add(d, [mid], `${d[mid]} < ${target}, search right half`, "compare", 4, {
        labels: { [mid]: "mid" }
      });
      low = mid + 1;
    } else {
      add(d, [mid], `${d[mid]} > ${target}, search left half`, "compare", 5, {
        labels: { [mid]: "mid" }
      });
      high = mid - 1;
    }
  }

  add(d, [], `Target ${target} not found`, "swap", 3);
}

function mergeSortFrames(d, add) {
  mergeSortInternal(d, 0, d.length - 1, add);
}

function mergeSortInternal(arr, l, r, add) {
  if (l >= r) return;

  let m = Math.floor((l + r) / 2);

  add(arr, range(l, r), `Splitting array from index ${l} to ${r}`, "compare", 2, {
    labels: { [l]: "left", [m]: "mid", [r]: "right" }
  });

  mergeSortInternal(arr, l, m, add);
  mergeSortInternal(arr, m + 1, r, add);
  merge(arr, l, m, r, add);
}

function merge(arr, l, m, r, add) {
  let left = arr.slice(l, m + 1);
  let right = arr.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;

  add(arr, range(l, r), `Merging parts [${l}..${m}] and [${m+1}..${r}]`, "compare", 5, {
    labels: { [l]: "L", [m]: "mid", [r]: "R" }
  });

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      arr[k] = left[i];
      add(arr, [k], `Placed ${left[i]} from left half`, "swap", 5, {
        labels: { [k]: "merged" }
      });
      i++;
    } else {
      arr[k] = right[j];
      add(arr, [k], `Placed ${right[j]} from right half`, "swap", 5, {
        labels: { [k]: "merged" }
      });
      j++;
    }
    k++;
  }

  while (i < left.length) {
    arr[k] = left[i];
    add(arr, [k], `Copied remaining ${left[i]} from left half`, "swap", 5, {
      labels: { [k]: "merged" }
    });
    i++;
    k++;
  }

  while (j < right.length) {
    arr[k] = right[j];
    add(arr, [k], `Copied remaining ${right[j]} from right half`, "swap", 5, {
      labels: { [k]: "merged" }
    });
    j++;
    k++;
  }
}

function quickSortFrames(d, add) {
  quickSortInternal(d, 0, d.length - 1, add);
}

function quickSortInternal(arr, low, high, add) {
  if (low < high) {
    let pi = partition(arr, low, high, add);
    quickSortInternal(arr, low, pi - 1, add);
    quickSortInternal(arr, pi + 1, high, add);
  }
}

function partition(arr, low, high, add) {
  let pivot = arr[high];
  let i = low - 1;

  add(arr, [high], `Pivot selected: ${pivot}`, "compare", 0, {
    labels: { [high]: "pivot" }
  });

  for (let j = low; j < high; j++) {
    add(arr, [j, high], `Comparing ${arr[j]} with pivot ${pivot}`, "compare", 2, {
      labels: { [j]: "j", [high]: "pivot" }
    });

    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      add(arr, [i, j], `Swapping ${arr[i]} and ${arr[j]}`, "swap", 2, {
        labels: { [i]: "i", [j]: "j" }
      });
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  add(arr, [i + 1], `Placed pivot ${pivot} at correct position`, "swap", 3, {
    labels: { [i + 1]: "pivot pos" }
  });

  return i + 1;
}

function range(a, b) {
  const out = [];
  for (let i = a; i <= b; i++) out.push(i);
  return out;
}

function render(idx) {
  const f = frames[idx];
  const canvas = document.getElementById("canvas");
  const log = document.getElementById("log-msg");
  const stepInfo = document.getElementById("step-info");

  log.innerText = f.m;
  stepInfo.innerText = `Step ${idx + 1}/${frames.length}`;

  document.querySelectorAll(".code-line").forEach(el => el.classList.remove("active"));
  if (f.ln !== -1) {
    const active = document.getElementById(`line-${f.ln}`);
    if (active) active.classList.add("active");
  }

  canvas.innerHTML = "";

  f.arr.forEach((v, i) => {
    const group = document.createElement("div");
    group.className = "element-group";

    if (f.meta && f.meta.labels && f.meta.labels[i]) {
      const ptr = document.createElement("div");
      ptr.className = "pointer";
      ptr.innerText = f.meta.labels[i];
      group.appendChild(ptr);
    }

    const box = document.createElement("div");
    box.className = "box";
    box.innerText = v;

    if (f.h.includes(i)) {
      if (f.type === "compare") {
        box.style.background = "var(--warning)";
        box.style.borderColor = "#f1c40f";
      } else if (f.type === "swap") {
        box.style.background = "#ffd6d6";
        box.style.borderColor = "var(--danger)";
      }
    }

    if (f.type === "sorted" && currentAlgo !== "binary") {
      box.style.background = "var(--success)";
      box.style.borderColor = "#16a085";
    }

    group.appendChild(box);
    canvas.appendChild(group);
  });
}

function togglePlay() {
  if (timer) {
    pause();
  } else {
    document.getElementById("play-btn").innerText = "PAUSE";
    timer = setInterval(() => {
      if (curIdx >= frames.length - 1) return pause();
      curIdx++;
      render(curIdx);
    }, document.getElementById("speed").value);
  }
}

function pause() {
  clearInterval(timer);
  timer = null;
  document.getElementById("play-btn").innerText = "START";
}

function scrub(d) {
  pause();
  curIdx = Math.max(0, Math.min(frames.length - 1, curIdx + d));
  render(curIdx);
}