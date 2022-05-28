const inquirer = require("inquirer");
const fs = require("fs").promises;
const path = require("path");

// const dbFile = path.join(__dirname, "dbFile.txt");
let id = 0;

const newEntry = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Укажите имя или нажмите Enter для отмены",
      },
      {
        type: "list",
        name: "sex",
        message: "Выберите пол",
        choices: ["Муж", "Жен"],
        when(answers) {
          return answers.name.length !== 0;
        },
      },
      {
        type: "input",
        name: "age",
        message: "Укажите возраст",
        when(answers) {
          return answers.name.length !== 0;
        },
        validate(num) {
          return isNaN(num) ? "Неверный формат, ведите число" : true;
        },
      },
    ])
    .then((answers) => {
      if (answers.name.length === 0) {
        return searchDB();
      }

      addItem(answers);
      newEntry();
    });
};

async function addItem(item) {
  try {
    await fs.writeFile(
      "dbFile.txt",
      `"${(id += 1)}": ` + JSON.stringify(item, null, "  ") + ",",
      {
        flag: "a",
      }
    );
  } catch (error) {
    console.error(`Got an error trying to write to a file: ${error.message}`);
  }
}

async function findDB(filePath, query) {
  try {
    let data = await fs.readFile(filePath);
    data = "{\n" + data.toString().replace(/,$/, "") + "\n}";
    data = JSON.parse(data);
    let exists = false;
    for (const el of Object.keys(data)) {
      if (query === data[el].name) {
        console.log(JSON.stringify(data[el]));
        exists = true;
      }
      // console.log(a[obj]);
    }
    if (exists === false) {
      console.log("User not found");
      exists = true;
    }
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`); // No db error
  }
}

const searchDB = () => {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "searchDB",
        message: "найти пользователя по имени в базе данных?",
      },
    ])
    .then((answer) => {
      if (answer.searchDB) {
        inquirer
          .prompt([
            {
              type: "input",
              name: "text",
              message: "Укажите имя для поиска",
            },
          ])
          .then((query) => {
            console.log("Searching...");
            findDB("dbFile.txt", query.text);
          });
      } else {
        process.exit();
      }
    });
};

newEntry();
