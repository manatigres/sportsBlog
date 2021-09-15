let nD = new Date();
let date = (today) => {
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

let splitDate = (date) => {
  var result = date.split('-');
  return result;
}

let splitD = (spdate) => {
  return year;
}

//sorting array by frequency of occurrences
let sortByFrequencyAndRemoveDuplicates = (array) => {
  var frequency = {},
    value;
  // compute frequencies of each value
  for (var i = 0; i < array.length; i++) {
    value = array[i];
    if (value in frequency) {
      frequency[value]++;
    } else {
      frequency[value] = 1;
    }
  }
  // make array from the frequency object to de-duplicate
  var uniques = [];
  for (value in frequency) {
    uniques.push(value);
  }
  // sort the uniques array in descending order by frequency
  let compareFrequency = (a, b) => {
    return frequency[b] - frequency[a];
  }
  return uniques.sort(compareFrequency);
}



// STATS FETCH AND CALCULATIONS

async function fetchG() {
  const [groupsResponse, usersResponse, gamesResponse, eventsResponse] = await Promise.all([
    fetch('/groups/all'),
    fetch('/users/all'),
    fetch('/games/all'),
    fetch('/events/all'),
  ]);
  const groups = await groupsResponse.json();
  const users = await usersResponse.json();
  const games = await gamesResponse.json();
  const events = await eventsResponse.json();
  return [groups, users, games, events];
}
fetchG().then(([groups, users, games, events]) => {
  // number of groups
  const totG = groups.length;
  let totGroups = document.getElementById("groupStat");
  totGroups.innerHTML = totG;

  // number of members
  const totU = users.length;
  let totUsers = document.getElementById("memberStat");
  totUsers.innerHTML = totU;

  // number of games
  const totGa = games.length;
  let totGames = document.getElementById("gameStat");
  totGames.innerHTML = totGa;

  // number of events
  const totE = events.length;
  let totEvents = document.getElementById("eventStat");
  totEvents.innerHTML = totE;

  let divi = totU / totG;
  divi = divi.toFixed(1);
  let cal = document.getElementById("memberag");
  cal.innerHTML = divi;

  let divi2 = totU / totGa;
  divi2 = divi2.toFixed(1);
  let cal2 = document.getElementById("memberaga");
  cal2.innerHTML = divi2;

  let divi3 = totU / totE;
  divi3 = divi3.toFixed(1);
  let cal3 = document.getElementById("memberae");
  cal3.innerHTML = divi3;

  // members per group
  let groupNames = [];
  for (i = 0; i < groups.length; i++) {
    groupNames.push(groups[i].name);
  }

  for (i = 0; i < groupNames.length; i++) {
    groupD(groupNames[i]);
  }

  let gch = document.getElementById("groupNames");
  for (i = 0; i < groupNames.length; i++) {
    let d = document.createElement("div");
    d.innerHTML = groupNames[i] + "<br>";
    gch.append(d);
  }

  let today = date(nD);
  //active games
  let counter = 0;
  for (i = 0; i < games.length; i++) {
    if (games[i].time >= today) {
      counter++;
    }
  }
  const totGaa = counter;
  let totGamez = document.getElementById("gameActive");
  totGamez.innerHTML = totGaa;

  //active events
  let counter2 = 0;
  for (i = 0; i < events.length; i++) {
    if (events[i].time >= today) {
      counter2++;
    }
  }
  const totEe = counter2;
  let totEventz = document.getElementById("eventActive");
  totEventz.innerHTML = totEe;

  // games per Year
  let counter3 = 0;
  let counter4 = 0;
  let counter5 = 0;
  for (i = 0; i < games.length; i++) {
    let splittedDate = splitDate(games[i].time);
    let year = splittedDate[0];
    if (year === "2020") {
      counter3++;
    }
    if (year === "2021") {
      counter4++;
    }
    if (year === "2022") {
      counter5++;
    }
  }
  let years = ["2020", "2021", "2022"];
  let yearCount = [counter3, counter4, counter5];
  let ysg = document.getElementById("gameYear");
  for (i = 0; i < years.length; i++) {
    let d = document.createElement("div");
    d.innerHTML = years[i] + "-" + yearCount[i];
    ysg.append(d);
  }
  // events per Year
  let counter6 = 0;
  let counter7 = 0;
  let counter8 = 0;
  for (i = 0; i < events.length; i++) {
    let splittedDateE = splitDate(events[i].time);
    let yearE = splittedDateE[0];
    if (yearE === "2020") {
      counter6++;
    }
    if (yearE === "2021") {
      counter7++;
    }
    if (yearE === "2022") {
      counter8++;
    }
  }
  let yearCountE = [counter6, counter7, counter8];
  let yse = document.getElementById("eventYear");
  for (i = 0; i < years.length; i++) {
    let d2 = document.createElement("div");
    d2.innerHTML = years[i] + "-" + yearCountE[i];
    yse.append(d2);
  }
  // games top locations
  let glocations = [];
  for (i = 0; i < games.length; i++) {
    glocations.push(games[i].location);
  }
  // console.log(locations);
  let gloc = sortByFrequencyAndRemoveDuplicates(glocations);
  // console.log(gloc);
  let gl = document.getElementById("gameLocation");
  for (var i = 0; i < gloc.length; i++) {
    let el = document.createElement('el');
    el.innerHTML = gloc[i] + "<br>";
    gl.append(el);
  }
  // events top locations
  let elocations = [];
  for (i = 0; i < events.length; i++) {
    elocations.push(events[i].location);
  }
  let eloc = sortByFrequencyAndRemoveDuplicates(elocations);
  let evl = document.getElementById("eventLocation");
  for (var i = 0; i < eloc.length; i++) {
    let el = document.createElement('el');
    el.innerHTML = eloc[i] + "<br>";
    evl.append(el);
  }

}).catch(error => {});

fetchG();


//Get group tag

function groupD(groupname) {
  fetch('/groups/' + groupname + '/users')
    .then(res => res.json())
    .then(data => {
      let len = data.length;
      let gu = document.getElementById("groupUsers");
        let d = document.createElement("div");
        d.setAttribute("width", "100px");
        d.innerHTML = len + "<br>";
        gu.append(d);
      })
}


const goBack = () => {
  location.href = "/"
}
