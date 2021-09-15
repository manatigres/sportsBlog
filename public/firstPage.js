const login = () => {
  location.href = ("/login")
}

const register = () => {
  location.href = ("/register")
}

const joinGroup = () => {
  alert("Please sign up or login to join a group!");
}

const joinGame = () => {
  alert("Please sign up or login to join a game!");
}

const joinEvent = () => {
  alert("Please sign up or login to join an event!");
}


// TOTAL stats


let nD = new Date();
let date = (today) => {
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

// MEMBERS

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

  // number of members
  const totM = users.length;
  let totUsers = document.getElementById("memberStat");
  totUsers.innerHTML = totM;

  // number of games
  const totGa = games.length;
  let totGames = document.getElementById("gameStat");
  totGames.innerHTML = totGa;

  // number of events
  const totE = events.length;
  let totEvents = document.getElementById("eventStat");
  totEvents.innerHTML = totE;

  // number of groups
  const totG = groups.length;
  let totGroups = document.getElementById("groupActive");
  totGroups.innerHTML = totG;

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


}).catch(error => {});

fetchG();


//insert youtube video
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player1', {
    height: '235',
    width: '360',
    videoId: 'kLte7hJOFZE',
  });

  player2 = new YT.Player('player2', {
    height: '235',
    width: '360',
    videoId: '4aBjJG2BdvY'
  });

  player3 = new YT.Player('player3', {
    height: '235',
    width: '360',
    videoId: 'e0OLdWB5L0w'
  });

  function onPlayerReady(event) {
    event.target.playVideo();
  }

  function pauseVideo() {
    player.pauseVideo();
  }

  function playVideo() {
    player.playVideo();
  }

  function stopVideo() {
    player.stopVideo();
  }
}

// NEWSFEED

//print news
const getNews = () => {
  fetch('/news')
    .then(res => res.json())
    .then(data => {
      console.log(data)
      var news = document.getElementById("newsfeed");
      for (let index = 0; index < 6; index++) {
        const element = data.articles[index];
        var elm = document.createElement('p');
        var newsfeed = document.createElement("a");
        var url = element.url;
        var linebreak = document.createElement("br");
        var img = document.createElement('img');
        img.setAttribute('style', 'width:200px;height:150px;')
        img.setAttribute('src', element.urlToImage);
        newsfeed.setAttribute("class", "newsfeed");
        newsfeed.setAttribute("href", url);
        newsfeed.setAttribute('target', "_blank");
        newsfeed.setAttribute('style', "font-size:75%; font-family:Calibri; color:black;")
        newsfeed.innerHTML = `&#9758 ${element.title}`;
        elm.append(img);
        news.append(elm);
        news.append(newsfeed);
        news.append(linebreak);
      }
    })
}

getNews();

// clear the storage information
if (typeof(Storage) !== "undefined") {
  localStorage.clear();
}
