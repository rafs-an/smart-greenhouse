 import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, onValue, set, get, update } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Firebase Config 
const firebaseConfig = {
  apiKey: "AIzaSyCq2yYvM4NctDEQhWIKFRHKCxr9SZbZvS8",
  authDomain: "smart-greenhouse-2d2ae.firebaseapp.com",
  projectId: "smart-greenhouse-2d2ae",
  storageBucket: "smart-greenhouse-2d2ae.appspot.com",
  messagingSenderId: "7437563094",
  appId: "1:7437563094:web:772e3115c577c169788577",
  databaseURL: "https://smart-greenhouse-2d2ae-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const sensorRef = ref(db, 'data');
const weatherRef = ref(db, 'weatherData');
const modeRef = ref(db, 'systemMode');
const statusRef = ref(db, 'status');


document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".inp-sec input");
  const button = document.querySelector(".inp-sec button");

  const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
  const apiKey = "16e4a8e8e5d1212f8ed2c9261ee65913";

  const buttauto = document.querySelector("#auto");
  const buttmanual = document.querySelector("#manual");
  const msg = document.querySelector(".msg");
  const manbutt = document.querySelector(".manbutt");

  // Display weather helper
  function displayWeather(data) {
    document.querySelector(".temp").innerHTML = data.main.temp + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind-speed").innerHTML = data.wind.speed + "km/h";
  }

  // Fetch weather & store in Firebase
  async function getData(city) {
    const response = await fetch(apiURL + city + `&appid=${apiKey}`);
    const data = await response.json();

    if (data.cod === 200) {
      displayWeather(data);
      await set(weatherRef, { city, data });
    } else {
      alert("City not found!");
    }
  }

  // Load saved weather on page load
  get(weatherRef).then((snapshot) => {
    if (snapshot.exists()) {
      const weatherInfo = snapshot.val();
      input.value = weatherInfo.city;
      displayWeather(weatherInfo.data);
    }
  });

  button.addEventListener("click", () => {
    const city = input.value.trim();
    if (city) getData(city);
  });

  // Update sensor data realtime 
  onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    document.querySelector('#temp .box').textContent = `${data.temperature ?? 'N/A'} °C`;
    document.querySelector('#moist .box').textContent = `${data.moisture ?? 'N/A'}`;
    document.querySelector('#pH .box').textContent = `${data.pH ?? 'N/A'}`;
    document.querySelector('#hum .box').textContent = `${data.humidity ?? 'N/A'} %`;
    document.querySelector('#watflo .box').textContent = `${data.waterFlow ?? 'N/A'} L/min`;
  });

  // Function to update all manual status messages
  async function updateStatusMessages() {
    const statusSnapshot = await get(statusRef);
    if (statusSnapshot.exists()) {
      const status = statusSnapshot.val();

      document.querySelector(".msgPump").textContent = status.pump ? "The water pump is on!" : "The water pump is off!";
      document.querySelector(".msgFerti").textContent = (status.fertilizer_base || status.fertilizer_acidic) ? "The fertilizer pump is on!" : "The fertilizer pump is off!";
      
    }
  }

  // ===== REAL-TIME STATUS LISTENER (NEW) =====
  onValue(statusRef, (snapshot) => {
    if (!snapshot.exists()) return;
    const status = snapshot.val();

    // Update messages in real-time
    document.querySelector(".msgPump").textContent = status.pump ? "The water pump is on!" : "The water pump is off!";
    document.querySelector(".msgFerti").textContent = (status.fertilizer_base || status.fertilizer_acidic) ? "The fertilizer pump is on!" : "The fertilizer pump is off!";

    get(modeRef).then((modeSnap) => {
      const mode = modeSnap.exists() ? modeSnap.val() : "manual";
      if (mode === "auto") {
        document.querySelector(".autoWat").style.backgroundColor = status.pump ? "red" : "#179c70f5";
        document.querySelector(".autoFert").style.backgroundColor = status.ventilation ? "red" : "#179c70f5";

        if (status.fertilizer_base) {
        document.querySelector(".autoFert").style.backgroundColor = "red";
        document.querySelector(".autoFert").textContent = "Basic Fertilizer";   // corrected
      } else if (status.fertilizer_acidic) {
       document.querySelector(".autoFert").style.backgroundColor = "red";
       document.querySelector(".autoFert").textContent = "Acidic Fertilizer";  // corrected
} else {
  document.querySelector(".autoFert").style.backgroundColor = "#179c70f5";
  document.querySelector(".autoFert").textContent = "FERTILIZER PUMP";
}

      }
    });
  });

  // ===== Auto Mode UI Listener =====
  onValue(statusRef, (snapshot) => {
    if (!snapshot.exists()) return;
    const status = snapshot.val();

    get(modeRef).then((modeSnap) => {
      const mode = modeSnap.exists() ? modeSnap.val() : "manual";

      if (mode === "auto") {
        // Pump
        document.querySelector(".autoWat").style.backgroundColor = status.pump ? "red" : "#179c70f5";

        // Fertilizer — base or acidic
       if (status.fertilizer_base) {
         document.querySelector(".autoFert").style.backgroundColor = "red";
         document.querySelector(".autoFert").textContent = "Basic Fertilizer";  
        } else if (status.fertilizer_acidic) {
        document.querySelector(".autoFert").style.backgroundColor = "red";
        document.querySelector(".autoFert").textContent = "Acidic Fertilizer";  
} else {
  document.querySelector(".autoFert").style.backgroundColor = "#179c70f5";
  document.querySelector(".autoFert").textContent = "FERTILIZER PUMP";
}


      } else {
        // Manual mode colors
        document.querySelector(".autoWat").style.backgroundColor = "#179c70f5";
        document.querySelector(".autoFert").style.backgroundColor = "#179c70f5";
        document.querySelector(".autoFert").textContent = "FERTILIZER PUMP";
      }
    });
  });

  // ===== Manual Mode Fertilizer Listener =====
  onValue(ref(db, "manualControl/fertilizerType"), (snapshot) => {
    const type = snapshot.val();
    if (type === "acidic") {
      document.querySelector(".msgFerti").textContent = "Acidic fertilizer selected.";
      document.querySelector(".acidic").classList.add("selected");
      document.querySelector(".basic").classList.remove("selected");
    } else if (type === "basic") {
      document.querySelector(".msgFerti").textContent = "Basic fertilizer selected.";
      document.querySelector(".basic").classList.add("selected");
      document.querySelector(".acidic").classList.remove("selected");
    } else {
      document.querySelector(".msgFerti").textContent = "No fertilizer selected.";
    }
  });

  // ===== Mode Buttons =====
  buttauto.addEventListener("click", async () => {
    await set(modeRef, "auto");

    // Reset all devices OFF when auto starts
    await update(statusRef, {
      pump: false,
      fertilizer_base: false,
      fertilizer_acidic: false,
      ventilation: false
    });

    document.querySelector(".autobutt").style.display = "block";
    msg.style.background = "linear-gradient(135deg, #1A5233 0%, #008B8B 100%)";
    manbutt.style.display = "none";
  });

  buttmanual.addEventListener("click", async () => {
    await set(modeRef, "manual");

    msg.style.background = "linear-gradient(to right, #1A5233 0%, #228B22 50%, #157B7B 100%)";
    manbutt.style.display = "flex";
    document.querySelector(".pump").style.display = "flex";
    document.querySelector(".ferti").style.display = "flex";
    document.querySelector(".autobutt").style.display = "none";

    await updateStatusMessages();
  });

  // ===== Manual Control Buttons =====
  document.querySelector(".pumpOn").addEventListener("click", async () => set(ref(db, 'status/pump'), true));
  document.querySelector(".pumpOff").addEventListener("click", async () => set(ref(db, 'status/pump'), false));

  document.querySelector(".acidic").addEventListener("click", async () => {
    await set(ref(db, "manualControl/fertilizerType"), "acidic");
    document.querySelector(".acidic").style.backgroundColor = "coral";
    document.querySelector(".basic").style.backgroundColor = "aquamarine";
  });

  document.querySelector(".basic").addEventListener("click", async () => {
    await set(ref(db, "manualControl/fertilizerType"), "basic");
    document.querySelector(".basic").style.backgroundColor = "coral";
    document.querySelector(".acidic").style.backgroundColor = "aquamarine";
  });

  document.querySelector(".fertiOn").addEventListener("click", async () => {
    // In manual mode, you decide which fertilizer
    const type = (await get(ref(db, "manualControl/fertilizerType"))).val();
    if (type === "basic") {
      await set(ref(db, 'status/fertilizer_base'), true);
      await set(ref(db, 'status/fertilizer_acidic'), false);
    } else if (type === "acidic") {
      await set(ref(db, 'status/fertilizer_acidic'), true);
      await set(ref(db, 'status/fertilizer_base'), false);
    }
  });

  document.querySelector(".fertiOff").addEventListener("click", async () => {
    await update(statusRef, { fertilizer_base: false, fertilizer_acidic: false });
  });

  // ===== On Page Load =====
  get(modeRef).then((snapshot) => {
    if (snapshot.exists()) {
      const mode = snapshot.val();
      if (mode === "manual") buttmanual.click();
      else buttauto.click();
    } else {
      buttmanual.click();
    }
  });
});
