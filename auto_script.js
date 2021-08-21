window.statusRun = false;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runAuto() {
  var toolbar = document.querySelectorAll(".navbar-container > div");
  toolbar[0].click();

  console.log("Run Auto Farmer World");
  window.statusRun = true;

  try {
    var els = document.querySelectorAll(
      "section[class='vertical-carousel-container'] img"
    );
    while (statusRun) {
      for (const element of els) {
        // Do stuff here
        await itemAction(element);
        await sleep(2000);
      }
    }
  } catch (error) {
    console.log("Có lỗi xảy ra");
    console.log(error);
    alert("Auto Farmerworld đã dừng , vui lòng kiểm tra lại");
  }
}

async function itemAction(element) {
  if (!window.statusRun) return;
  console.log(element);
  console.log("Select Element");
  element.scrollIntoView();
  element.click();

  await sleep(2000);
  // Check Repair

  var craft = document.querySelector(".content").textContent.split("/");
  if (parseInt(craft[0]) == 0) {
    if (!(await repairItem())) {
      console.log("Repair Failed");
      return;
    }
  } else console.log("No need to repair Item");

  // Mine
  if (await mineItem()) {
    console.log("Mining Sucess");
  } else console.log("Mining Failed");
}

// Mine
async function mineItem() {
  if (
    document.querySelector(".info-time").textContent.localeCompare("00:00:00")
  ) {
    console.log("Can't mine right now");
    return false;
  }
  console.log("Mine Item");
  var btn = document.querySelector(
    "div[class='tooltip home-card-button--item']:nth-of-type(1) > div >div"
  );
  //   if (btn.className.includes("disable")) return false;
  btn.click();
  return await waitTransition();
}

async function repairItem() {
  console.log("Repair Item");
  var btn = document.querySelector(
    "div[class='tooltip home-card-button--item']:nth-of-type(2) > div >div"
  );
  if (btn.className.includes("disable")) return false;
  btn.click();
  return await waitTransition();
}

// Waiting Transistion
async function waitTransition() {
  const transition = new Promise((resolve, reject) => {
    var i = 0;
    var checkExist = setInterval(function () {
      ++i;

      if (!statusRun || !document.querySelector("[role='dialog']")) {
        clearInterval(checkExist);
        resolve(true);
      }
      console.log("Waiting Approve");

      try {
        if (document.querySelector(".modal-content")) {
          console.log(
            "Error : " + document.querySelector(".modal-content").textContent
          );
          document.querySelector(".short").click();
          clearInterval(checkExist);
          resolve(false);
        }
      } catch (error) {
        console.log(error);
        console.log("Not found Error");
      }

      try {
        if (!document.querySelector("#loadingModal")) {
          clearInterval(checkExist);
          resolve(true);
        }
      } catch (error) {}

      if (i == 5 * 60) {
        try {
          document.querySelector(".image-button").click();
        } catch (error) {}
        clearInterval(checkExist);
        resolve(false);
      }
    }, 1000); // check every 100ms
  });
  return await transition;
}

function stopRun() {
  statusRun = false;
}
