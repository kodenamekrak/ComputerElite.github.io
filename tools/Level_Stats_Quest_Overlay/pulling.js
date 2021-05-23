function format(text, returnType = 0) {
    return text == "" ? (returnType >= 1 ? (returnType >= 2 ? "SS" : "0") : "N/A") : text
}

function intToDiff(diff) {
    switch (diff)
    {
        case 0:
            return "Easy";
        case 1:
            return "Normal";
        case 2:
            return "Hard";
        case 3:
            return "Expert";
        case 4:
            return "Expert +";
    }
    return "Unknown";
}

function SetPercentage(percentage) {
    try {
        bar.style.width = (percentage * 100) + "%"
    } catch {}
}


var lastID = "";
var lastSongKey = "";

function SetImage(id) {
    if(!id.startsWith("custom_level_")) return;
    if(id == lastID) return;
    lastID = id
    fetch("https://beatsaver.com/api/maps/by-hash/" + id.replace("custom_level_", "")).then((result) => {
        result.json().then((json) => {
            cover.src = "https://beatsaver.com" + json["coverURL"]
            key.innerHTML = json["key"]
            
            try {
                prekey.innerHTML = lastSongKey
            } catch {}
            lastSongKey = json["key"]
        })
    })
}

var url_string = window.location.href
var url = new URL(url_string);
var ip = url.searchParams.get("ip");
var rate = url.searchParams.get("updaterate")
var decimals = url.searchParams.get("decimals")

var showmpcode = url.searchParams.get("dontshowmpcode")
if(showmpcode == null) showmpcode = true;
else showmpcode = false

var showenergyBar = url.searchParams.get("dontshowenergy")
if(showenergyBar == null) showenergyBar = true;
else showenergyBar = false

if(ip == null || ip == "") {
    ip = prompt("Please enter your Quests IP:", "192.168.x.x");
}
if(rate == null) rate = 1000
if(decimals == null) decimals = 2
console.log("update rate: " + rate)
console.log("decimals for percentage: " + decimals)
console.log("ip: " + ip)
console.log("show mp code: " + showmpcode)
console.log("show energy bar: " + showenergyBar)

var bar = document.getElementById("energybar")
var barContainer = document.getElementById("energybarContainer")
var songName = document.getElementById("songName")
var songAuthor = document.getElementById("songAuthor")
var mapper = document.getElementById("mapper")
var diff = document.getElementById("diff")
var combo = document.getElementById("combo")
var score = document.getElementById("score")
var cover = document.getElementById("cover")
var key = document.getElementById("key")
var rank = document.getElementById("rank")
var percentage = document.getElementById("percentage")
var songSub = document.getElementById("songSub")
var njs = document.getElementById("njs")
var bpm = document.getElementById("bpm")
var timePlayed = document.getElementById("timePlayed")
var totalTime = document.getElementById("totalTime")
var mpCode = document.getElementById("mpCode")
var mpCodeContainer = document.getElementById("mpCodeContainer")
var prekey = document.getElementById("preKey")

var useLocalhost = false;
const localip = 'http://localhost:2078/api/raw'

fetch(localip).then((res) => {
    useLocalhost = true
}).catch(() => {
    useLocalhost = false
})

setInterval(function() {
    fetch(useLocalhost ? localip : "http://" + ip + ":3501").then((response) => {
        response.json().then((stats) => {
            console.log(stats)
            SetPercentage(stats["energy"])
            try {
                songName.innerHTML = format(stats["levelName"])
            } catch {}
            try {
                songAuthor.innerHTML = format(stats["songAuthor"])
            } catch {}
            try {
                mapper.innerHTML = format(stats["levelAuthor"])
            } catch {}
            try {
                diff.innerHTML = intToDiff(stats["difficulty"])
            } catch {}
            try {
                combo.innerHTML = format(stats["combo"], 1)
            } catch {}
            try {
                score.innerHTML = format(AddComma(stats["score"]), 1)
            } catch {}
            try {
                rank.innerHTML = format(stats["rank"], 2)
            } catch {}
            try {
                percentage.innerHTML = format(trim(stats["accuracy"] * 100)) + " %"
            } catch {}
            try {
                SetImage(stats["id"])
            } catch {}
            try {
                songSub.innerHTML = format(stats["levelSubName"])
            } catch {}
            try {
                njs.innerHTML = format(stats["njs"])
            } catch {}
            try {
                bpm.innerHTML = format(stats["bpm"], 1)
            } catch {}
            try {
                if(stats["type"] == 2 || stats["type"] == 5) {
                    // Is in mp lobby or song
                    console.log(showmpcode)
                    if(stats["mpGameIdShown"] && showmpcode) {
                        mpCode.innerHTML = format(stats["mpGameId"])
                    } else {
                        mpCode.innerHTML = "*****"
                    }
                } else {
                    mpCode.innerHTML = "not in lobby"
                }
            } catch {}
            try {
                if((stats["type"] == 2 || stats["type"] == 5) && showmpcode) {
                    mpCodeContainer.style.display = "block"
                } else {
                    mpCodeContainer.style.display = "none"
                }
            } catch {}
            try {
                updateTime(stats["endTime"], stats["time"])
            } catch {}

            try {
                if(!showenergyBar) {
                    barContainer.style.display = "none"
                }
            } catch {}
        })
    })
}, rate)

function AddComma(input) {
    return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function trim(input) {
    return input.toFixed(decimals)
}

function ToElapsed(input) {
    var date = new Date(0);
    date.setSeconds(input); // specify value for SECONDS here
    var timeString = date.toISOString().substr(14, 5);
    return timeString
}