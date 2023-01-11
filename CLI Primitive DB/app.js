const inquirer = require("inquirer");
const fs = require("fs").promises;

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
          return isNaN(num) || num === ""
            ? "Неверный формат, введите число"
            : true;
        },
      },
    ])
    .then((answers) => {
      if (answers.name.length === 0) {
        searchDB();
      } else {
        addItem(answers);
        newEntry();
      }
    });
};

async function addItem(item) {
  try {
    await fs.writeFile("dbFile.txt", JSON.stringify(item, null, "  ") + ",", {
      flag: "a",
    });
  } catch (error) {
    console.error(`Got an error trying to write to a file: ${error.message}`);
  }
}

async function findDB(filePath, query) {
  try {
    let data = await fs.readFile(filePath);
    data = "[ " + data.toString().replace(/,$/, "") + " ]";
    data = JSON.parse(data);
    let answers = [];
    for (const el of data) {
      if (el.name.toLowerCase().includes(query.toLowerCase())) {
        answers.push(el);
      }
    }
    if (answers.length === 0) {
      console.log("User not found");
    } else {
      for (let e of answers) {
        console.log(e);
      }
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
