let name = localStorage.getItem("userName");
// console.log(name);
document.getElementById("name").innerHTML = name;


let email = localStorage.getItem("userEmail");
// console.log(email);
document.getElementById("email").innerHTML = email;

// get today's date
let nD = new Date();
let date = (today) => {
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

//print all
async function fetchG(email) {
  const [groupsResponse, gamesResponse, eventsResponse, allGamesResponse, allEventsResponse] = await Promise.all([
    fetch(`/users/${email}/groups`),
    fetch(`/users/${email}/games`),
    fetch(`/users/${email}/events`),
    fetch('/games/all'),
    fetch('/events/all')
  ]);
  const groups = await groupsResponse.json();
  const games = await gamesResponse.json();
  const events = await eventsResponse.json();
  const allGames = await allGamesResponse.json();
  const allEvents = await allEventsResponse.json();
  return [groups, games, events, allGames, allEvents];
}

fetchG(email).then(([groups, games, events, allGames, allEvents]) => {

  // number of groups
  console.log(groups);
  const totG = groups.length;
  let totGroups = document.getElementById("groupTot");
  totGroups.innerHTML = totG;

  // number of games
  console.log(games);
  const totGa = games.length;
  let totGames = document.getElementById("gameTot");
  totGames.innerHTML = totGa;

  // number of events
  console.log(events);
  const totE = events.length;
  let totEvents = document.getElementById("eventTot");
  totEvents.innerHTML = totE;

  console.log(allGames);
  console.log(allEvents);
  let today = date(nD);

  // personal groups list
  let groupsList = [];
  for (i = 0; i < groups.length; i++) {
    groupsList.push(groups[i].group);
  }

  // personal upcoming games
  let upcomingGames = [];
  for (i = 0; i < games.length; i++) {
    for (j = 0; j < allGames.length; j++) {
      if (games[i].game === allGames[j].name) {
        if (allGames[j].time >= today) {
          upcomingGames.push(allGames[j].name);
        }
      }
    }
  }
  console.log(upcomingGames);

  // personal upcoming events
  let upcomingEvents = [];

  for (i = 0; i < events.length; i++) {
    for (j = 0; j < allEvents.length; j++) {
      if (events[i].event === allEvents[j].name) {
        if (allEvents[j].time >= today) {
          upcomingEvents.push(allEvents[j].name);
        }
      }
    }
  }
  console.log(upcomingEvents);

  printList(groupsList, "groupList");
  printList(upcomingGames, "gameList");
  printList(upcomingEvents, "eventList");

}).catch(error => {});

fetchG();

// print on html

const printList = (obj, elm) => {
  let list = document.getElementById(elm);
  let li = document.createElement('ul');
  for (var i = 0; i < obj.length; i++) {
    let el = document.createElement('el');
    el.innerHTML = obj[i] + "<br>";
    li.append(el);
  }
  list.append(li);
}


const goBack = () => {
  location.href = "/"
}
