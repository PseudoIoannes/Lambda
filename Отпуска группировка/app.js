const fs = require("fs");
const path = require("path");

fs.readFile(path.join(__dirname, "data.json"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let beforeTransformation = JSON.parse(data);
  let afterTransformation = {};
  for (let obj of beforeTransformation) {
    if (!(obj.user._id in afterTransformation)) {
      afterTransformation[obj.user._id] = {};
      afterTransformation[obj.user._id].userID = obj.user._id;
      afterTransformation[obj.user._id].name = obj.user.name;
      afterTransformation[obj.user._id].weekendDates = [];
    }
    afterTransformation[obj.user._id].weekendDates.push({
      startDate: obj.startDate,
      endDate: obj.endDate,
    });
  }
  //   console.log(afterTransformation);

  fs.writeFile(
    "./transformedData.json",
    JSON.stringify(Object.values(afterTransformation)),
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
});
