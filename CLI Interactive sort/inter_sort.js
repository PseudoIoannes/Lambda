const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

const askQuestion = () => {
readline.question(`Введите нескольких слов и чисел через пробел\n`, text => {
    text = text.split(' ');
    readline.question(`какую операцию проделать со словами и числами?\n
         sba - Отсортировать слова по алфавиту
         stb - Отобразить числа от меньшего к большему
         bts- Отобразить числа от большего к меньшему
         asc - Отобразить слова в порядке возрастания по количеству букв в слове
         uniw- Показать только уникальные слова
         univ- Показать только уникальные значения из всего введённого пользователем набора слов и чисел.
         exit - Для выхода из программыдостаточно ввести 'exit'.\n`, operation => {

        let result;
        switch (operation) {
            case 'sba':
               result = text.filter(word => isNaN(word)).sort()
               break;
            case 'stb':
                result = text.filter(word => !isNaN(word)).sort((a, b) => a - b);
                break;
            case 'bts':
                result = text.filter(word => !isNaN(word)).sort((a, b) => b - a);
                break;
            case 'asc':
                result = text.filter(word => isNaN(word)).sort((a, b) => a.length - b.length);
                break;
            case 'uniw':
                result = Array.from(new Set(text.filter(word => isNaN(word))))
                break;
            case 'univ':
                result= Array.from(new Set(text))
                break;
            case 'exit':
                process.exit();
            default:
                result= `Unknown command`;
        }
          console.log(result);
          askQuestion();
        // readline.close();
    });
});

}
askQuestion()