
async function loadsAttractionsWithoutKeyword(pageNumber) {
    try {
        let response = await fetch(`api/attractions?page=${pageNumber}`);
        let data = await response.json();
        let attractions = data["data"];
        page = data["nextPage"];
        let attractionList = document.querySelector("#attractions-list")
        for (let attraction of attractions) {
            renderAttraction(attraction, attractionList);
        }
    }
    catch (error) {
        console.error("Error", error);
    }
}

async function loadsAttractionsByKeyword(pageNumber, keywordString) {
    try {
        let response = await fetch(`api/attractions?page=${pageNumber}&keyword=${keywordString}`);
        let data = await response.json();
        let attractions = data["data"];
        let attractionList = document.querySelector("#attractions-list")
        console.log(attractions);
        if (attractions.length !== 0) {
            page = data["nextPage"];
            for (let attraction of attractions) {
                renderAttraction(attraction, attractionList);
            }
        } else {
            alert("查無相關資料。")
        }

    }
    catch (error) {
        console.error("Error", error);
    }
}

async function loasdMrts() {
    try {
        let response = await fetch(`api/mrts`);
        let data = await response.json();
        let mrts = data["data"];

        let mrtsList = document.querySelector("#mrts-list")
        for (let mrt of mrts) {
            let mrtNode = document.createElement("li");
            mrtNode.className = "mrt-name";
            mrtNode.textContent = mrt;
            mrtsList.appendChild(mrtNode);
        }
    }
    catch (error) {
        console.error("Error", error);
    }
}

function clearAttraction() {
    console.log("clear attractions")
    let attractionList = document.querySelector("#attractions-list");
    while (attractionList.firstChild) {
        attractionList.removeChild(attractionList.firstChild);
    }
}

function renderAttraction(dict, node) {

    let category = document.createElement("div");
    category.className = "category";

    let attractionMrt = document.createElement("p");
    attractionMrt.className = "attraction-mrt";
    attractionMrt.textContent = dict["mrt"]

    let attractionCategory = document.createElement("div");
    attractionCategory.className = "attraction-category";
    attractionCategory.textContent = dict["category"]

    let attractionForName = document.createElement("div");
    attractionForName.className = "attraction-for-name";

    let attractionName = document.createElement("p")
    attractionName.className = "attraction-name";
    attractionName.textContent = dict["name"];


    let attractionImage = document.createElement("div");
    attractionImage.className = "attraction-images";
    attractionImage.style.backgroundImage = `url(${dict["images"][0]})`


    let attractionNode = document.createElement("div");
    attractionNode.className = "attraction";

    category.appendChild(attractionMrt);
    category.appendChild(attractionCategory);

    attractionForName.append(attractionName)
    attractionImage.append(attractionForName);

    attractionNode.appendChild(attractionImage);
    attractionNode.appendChild(category);


    node.appendChild(attractionNode);

}

function scrollPage(pageNumber) {
    const attractionList = document.querySelector("#attractions-list");
    const attractRect = attractionList.getBoundingClientRect();
    const buffer = 100;
    if (attractRect.bottom <= window.innerHeight + window.scrollY + buffer) {
        if (searchWay == "withoutKeyword") {
            console.log("page=" + pageNumber)
            loadsAttractionsWithoutKeyword(pageNumber);
        } else if (searchWay == "keyword") {
            console.log("page=" + pageNumber)
            loadsAttractionsByKeyword(page, keyword);
        }
    }
}



let page;
let keyword;
let searchWay = "withoutKeyword";
const searchForm = document.querySelector("#search-bar");
const searchKeyword = document.querySelector("#search-bar-input");
const leftArrow = document.querySelector("#arrow-left");
const rightArrow = document.querySelector("#arrow-right");
const mrtsForm = document.querySelector("#mrts-form");
const mrtsList = document.querySelector("#mrts-list");


loasdMrts();
loadsAttractionsWithoutKeyword(0, keyword);

// reander attractions section

window.addEventListener("scroll", function () {
    if (page) {
        scrollPage(page)
    }
});


searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    keyword = searchKeyword.value;
    if (keyword) {
        searchWay = "keyword";
        page = 0;
        clearAttraction();
        loadsAttractionsByKeyword(page, keyword)
    } else {
        alert("請輸入景點名稱。")
    }
})


mrtsList.addEventListener("click", function (event) {
    if (event.target.classList.contains("mrt-name")) {
        keyword = event.target.textContent;
        page = 0;
        searchWay = "keyword";
        console.log("mrts")
        console.log(keyword, page);
        clearAttraction();
        loadsAttractionsByKeyword(page, keyword);
    }
})




//  mrt move

rightArrow.addEventListener("mouseenter", function () {
    rightArrow.firstElementChild.style.backgroundImage = 'url("static/images/rightArrowHovered.png")'
})
rightArrow.addEventListener("mouseover", function () {
    rightArrow.firstElementChild.style.backgroundImage = 'url("static/images/rightArrowDefault.png")'
})

leftArrow.addEventListener("mouseenter", function () {
    leftArrow.firstElementChild.style.backgroundImage = 'url("static/images/leftArrowHovered.png")'
})
leftArrow.addEventListener("mouseover", function () {
    leftArrow.firstElementChild.style.backgroundImage = 'url("static/images/leftArrowDefault.png")'
})



rightArrow.addEventListener("click", function (event) {
    const mrts = document.querySelectorAll(".mrt-name");
    const lastMrt = mrts[mrts.length - 1];
    if (lastMrt.getBoundingClientRect().right >= mrtsForm.getBoundingClientRect().right) {
        mrts.forEach((element) => {
            let currentTransForm = element.style.transform;
            let transFormValue = 0;
            if (currentTransForm) {
                console.log("TRUE")
                console.log("currentTransForm :" + currentTransForm);
                currentTransForm = currentTransForm.replace("translateX(", "").replace("px)", "")
                console.log("currentTransForm :" + currentTransForm);
                currentTransForm = parseInt(currentTransForm);
            } else {
                console.log("False")
                currentTransForm = 0;
            }
            transFormValue = parseInt(currentTransForm - 50);
            element.style.transform = `translateX(${transFormValue}px)`;
        })
    } else {
        alert("資料到底")
    }
});

leftArrow.addEventListener("click", function (event) {
    console.log("right-arrow");
    const mrts = document.querySelectorAll(".mrt-name");
    const lastMrt = mrts[0];

    if (lastMrt.getBoundingClientRect().right <= mrtsForm.getBoundingClientRect().left) {
        mrts.forEach((element) => {
            let currentTransForm = element.style.transform;
            let transFormValue = 0;
            if (currentTransForm) {
                currentTransForm = currentTransForm.replace("translateX(", "").replace("px)", "")
                currentTransForm = parseInt(currentTransForm);
            } else {
                currentTransForm = 0;
            }
            transFormValue = parseInt(currentTransForm + 50);
            element.style.transform = `translateX(${transFormValue}px)`;
        });
    } else {
        alert("資料到底")
    }
});

// signin & signup
const navSignin = document.querySelector("#nav-signin");
const navSignup = document.querySelector("#nav-signup");
const navBg = document.querySelector("#dialog-bg");

const dialogSignin = document.querySelector("#dialog-signin");
const closeSignin = document.querySelector("#close-signin");
const signinForm = document.querySelector("#signin-form");

const dialogSignup = document.querySelector("#dialog-signup");
const closeSignup = document.querySelector("#close-signup");
const signupForm = document.querySelector("#signup-form");


function showSignin() {
    navBg.style.display = "flex";
    dialogSignup.style.display = "none";
    dialogSignin.style.display = "flex";
}

function showSignup() {
    navBg.style.display = "flex";
    dialogSignin.style.display = "none";
    dialogSignup.style.display = "flex";

}

function closeDialog() {
    navBg.style.display = "none";
    dialogSignin.style.display = "none";
    dialogSignup.style.display = "none";
}


navSignin.addEventListener("click", function (event) {
    showSignin()
});

navSignup.addEventListener("click", function (event) {
    showSignup()
});

closeSignin.addEventListener("click", function () {
    closeDialog()
});
closeSignup.addEventListener("click", function () {
    closeDialog()
});

signinForm.addEventListener("submit", function (event) {
    event.preventDefault()
});

signupForm.addEventListener("submit", function (event) {
    event.preventDefault()
});