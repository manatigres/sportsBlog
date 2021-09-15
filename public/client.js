// ACTIVE stats

let nD = new Date();
let date = (today) => {
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

async function fetchG() {
  const [groupsResponse, gamesResponse, eventsResponse] = await Promise.all([
    fetch('/groups/all'),
    fetch('/games/all'),
    fetch('/events/all'),
  ]);
  const groups = await groupsResponse.json();
  const games = await gamesResponse.json();
  const events = await eventsResponse.json();
  return [groups, games, events];
}
fetchG().then(([groups, games, events]) => {
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


//print all events and game on menu
function printList(obj, elm1, elm2, att) {
  var list = document.getElementById(elm1);
  var sel = document.createElement('select');
  sel.setAttribute("size", "10");
  sel.setAttribute("id", `${elm1}`);
  for (var i = 0; i < obj.length; i++) {
    var opt = document.createElement('option');
    opt.text = obj[i][att];
    sel.add(opt);
  }
  list.append(sel);
  sel.addEventListener('change', (event) => {
    var desDiv = document.getElementById(elm2)
    while (desDiv.firstChild) {
      desDiv.removeChild(desDiv.firstChild);
    }
    var para_name = document.createElement('div');
    var para_time = document.createElement('div');
    var para_location = document.createElement('div');
    para_name.setAttribute('id', event.target.value)
    para_name.setAttribute('class', 'selected');
    //console.log(event.target.selectedIndex);
    para_name.innerHTML = event.target.value;
    para_time.innerHTML = `Time: ${obj[event.target.selectedIndex].time}`;
    para_location.innerHTML = `Location: ${obj[event.target.selectedIndex].location}`;
    desDiv.append(para_name);
    desDiv.append(para_time);
    desDiv.append(para_location);
  })
}

//print all groups on menu
function printGroup(obj, elm1, att) {
  var list = document.getElementById(elm1);
  var sel = document.createElement('select');
  sel.setAttribute("size", "10");
  sel.setAttribute("id", `${elm1}`);
  for (var i = 0; i < obj.length; i++) {
    let opt = document.createElement('option');
    //console.log(obj[i][att]);
    opt.text = obj[i][att];
      opt.onclick = () => {
          location.href = ('/groups/' + opt.text);
      }
    sel.add(opt);

  }
  list.append(sel);

}

//print latest Event
function latestEvents() {
  var elm1 = "selEvent";
  var elm2 = "desEvent";
  fetch('/events/all')
    .then(res => res.json())
    .then(eventData => {
      //console.log(eventData);
      var att = "name";
      printList(eventData, elm1, elm2, att);
    })
}

//print latest group
function latestGroups() {
    var elm1 = "groupList";
    fetch('/groups/all')
        .then(res => res.json())
        .then(groupData => {
            var att = "name";
            printGroup(groupData, elm1, att);
        })
}

//print latest Game
function latestGames() {
  var elm1 = "selGame";
  var elm2 = "desGame";
  fetch('/games/all')
    .then(res => res.json())
    .then(gameData => {
      console.log(gameData);
      var att = "name";
      printList(gameData, elm1, elm2, att);
    })
}

//print Groups
function showGroup() {
  var elm1 = "selGroup";
  var elm2 = "desGroup";
  fetch('/groups/all')
    .then(res => res.json())
    .then(groupData => {
      console.log(groupData);
      var att = "name";
      printGroup(groupData, elm1, elm2, att);
    })
}

// Click to create a group
const joinGroup = () => {
  alert("Groups can be joined on their dedicated page")
}

// Click to create a group
const createGroup = () => {
  location.href = ("/derictGroup")
}

const groupList = () => {
  fetch('/groups/all')
    .then(res => res.json())
    .then(groupData => {
      for (let i of groupData) {
        let btn = document.createElement("button");
        let group_name = i.name;
        btn.innerText = group_name;
        document.getElementById("groupList").appendChild(btn);
        btn.onclick = () => {
          location.href = ('/groups/' + group_name);
        }
      }
    })
}

// Create event button
const createEventButton = () =>{
  console.log("To Event")
  location.href = ("/events/create");
}

function eventList() {
  fetch('/events/all')
    .then(res => res.json())
    .then(eventData => {
      for (let i of eventData) {
        let il = document.createElement("li")
        let event_name = i.event_name
        il.innerText = event_name
        document.getElementById("eventList").appendChild(il)
        il.onclick = () => {
          location.href = ('/events/' + event_name)
        }
      }
    })
}

//Create game button
const createGame = () => {
  console.log("To Event")
  location.href = ("/games/create");
}

function gameList() {
  fetch('/games/all')
    .then(res => res.json())
    .then(gameData => {
      for (let i of gameData) {
        let il = document.createElement("li")
        let game_name = i.game_name
        il.innerText = game_name
        document.getElementById("gameList").appendChild(il)
        il.onclick = () => {
          location.href = ('/games/' + game_name)
        }
      }
    })
}

latestGroups()
//eventList()
//gameList()
latestEvents();
latestGames();


//Join Game
const joinGame = () => {
  let userId = localStorage.getItem('userEmail');
  console.log(userId);

  if (document.querySelector("#desGame .selected")) {
    var gamename = document.querySelector("#desGame .selected").innerHTML;
    console.log(gamename);
    fetch(`/games/${String(gamename)}/users/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(res => res.text())
    .then(data => alert(data))
  } else {
    alert ("Please select a game")
  }
}

//Join Event
const joinEvent = () => {
  let userId = localStorage.getItem('userEmail');
  console.log("Join event");
  if (document.querySelector("#desEvent .selected")) {
    var eventname = document.querySelector("#desEvent .selected").innerHTML;
    console.log(eventname);
    fetch(`/events/${String(eventname)}/users/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(res => res.text())
    .then(data => alert(data))

  }else {
    alert ("Please select an event");
  }

}


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

//print news
function getNews() {
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
