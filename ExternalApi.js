async function fetchData() {
  try {
    const response = await fetch(
      "https://champagne-bandicoot-hem.cyclic.app/api/data"
    );
    if (!response) {
      throw new Error("error in getting response");
    }
    const jsonData = await response.json();
    return jsonData.data; // Assuming the data is an array within the JSON
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error to be handled in calculatingtime()
  }
}

async function calculatingtime() {
  try {
    const data = await fetchData();
    //console.log("Data:", data);
    sortingAndRes(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

calculatingtime();

function sortingAndRes(data) {
  const totalHoursByEmailAndIP = {};

  data.sort((a, b) => {
    const emailA = a.email.toLowerCase();
    const emailB = b.email.toLowerCase();
    if (emailA < emailB) {
      return -1;
    } else if (emailA > emailB) {
      return 1;
    } else {
      return 0;
    }
  });

  data.forEach((obj) => {
    const email = obj.email;
    const ip = obj.ip_address;
    const totalTime = obj.total_time;

    if (!totalHoursByEmailAndIP[email]) {
      totalHoursByEmailAndIP[email] = {};
      totalHoursByEmailAndIP[email].hours = 0;
      totalHoursByEmailAndIP[email].minutes = 0;
    }

    if (!totalHoursByEmailAndIP[email][ip]) {
      totalHoursByEmailAndIP[email][ip] = {
        hours: 0,
        minutes: 0,
      };
    }

    if (totalTime !== null) {
      const [hours, minutes] = totalTime.split(":");
      const hoursNum = parseInt(hours);
      const minutesNum = parseInt(minutes);

      totalHoursByEmailAndIP[email][ip].hours += hoursNum;
      totalHoursByEmailAndIP[email][ip].minutes += minutesNum;

      if (totalHoursByEmailAndIP[email][ip].minutes >= 60) {
        totalHoursByEmailAndIP[email][ip].hours += Math.floor(
          totalHoursByEmailAndIP[email][ip].minutes / 60
        );
        totalHoursByEmailAndIP[email][ip].minutes %= 60;
      }
      totalHoursByEmailAndIP[email].hours += hoursNum;
      totalHoursByEmailAndIP[email].minutes += minutesNum;

      if (totalHoursByEmailAndIP[email].minutes >= 60) {
        totalHoursByEmailAndIP[email].hours += Math.floor(
          totalHoursByEmailAndIP[email].minutes / 60
        );
        totalHoursByEmailAndIP[email].minutes %= 60;
      }
    }
  });

  console.log(totalHoursByEmailAndIP);
}
