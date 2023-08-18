import { createUserTask, getTasks, deleteUserTask,  updateTask} from './RealmDB/Actions';
import { iIncomeComandInterface } from './RealmDB/Interfaces';

const numeralDictionary: string[] = [
    'первой',
    'второй',
    'третьей',
    'четвёртой',
    'пятой',
    'шестой',
    'седьмой',
    'восьмой',
    'девятой',
    'десятой',
    'одиннадцатой',
    'двенадцатой',
    'тринадцатой',
    'четырнадцатой',
    'пятнадцатой',
    'шестнадцатой',
    'семнадцатой',
    'восемнадцатой',
    'девятнадцатой',
    'двадцатой',
    'двадцать первой'
 ];

  function getNumeralCase(number: number): string {
    return numeralDictionary[number] || 'Неподдерживаемое число';
  }
export default function TaskRouter(TaskInJson: Array<iIncomeComandInterface>): string {

    console.log(typeof TaskInJson)

    // console.log(JSON.parse(TaskInJson))

    const foundedTasks = TaskInJson.map((task,index)=> {
        console.log('VVOD V ROUTER');
        console.log(task)
        const {ACT,DATE,TIME,TASK,PER,LEMMACT,LEMMDATE,LEMMTIME,LEMMTASK,LEMMPER, CREATE} = task

        console.log(LEMMPER);
        if (LEMMPER && LEMMPER[0] !== 'я' && LEMMPER[0] !== 'мой') {
            console.log(13);
            return `пользователь ${LEMMPER[0]} не найден`
        }

    
        if(LEMMACT) {
            if (LEMMACT[0] === 'найти' || LEMMACT[0] === "какие" || LEMMACT[0] === "какой") {
                console.log(task);
                const tasks = getTasks({...task, PER: ["я"]})
                console.log(tasks);
                console.log(`кол-во текущих задач: ${tasks.length}`)
                if (tasks.length > 0) {
                    console.log(`Найдена задача ${tasks[0].name} в ${tasks[0].time} ${tasks[0].date}`);
                    const foundedTasks = tasks.reduce((acc,i,index)=> {
                    return acc + ` ${index+1}) ${i.name} в ${i.time} ${i.date}'.`
                    },`Всего найдено задач: ${tasks.length}'. `)
                    console.log(tasks);
                    console.log(17);
                    console.log(foundedTasks);
                    return foundedTasks
                } else {
                    return 'Задача не найдена'
                }

            }

            if (LEMMACT[0] === 'кто') {
    d
                if (CREATE) {
                    console.log(task);
                    const tasks = getTasks(task)
                    console.log(tasks);
                    console.log(`кол-во текущих задач: ${tasks.length}`)
                    if (tasks.length > 0) {
                        return `Найдено задач: ${tasks.length}. Создатель: Вы`
                    } else {
                        return 'Задача не найдена'
                    }

                } else {
                    console.log(task);
                    const tasks = getTasks(task)
                    console.log(tasks);
                    console.log(`кол-во текущих задач: ${tasks.length}`)
                    if (tasks.length > 0) {
                        console.log(`Найдена задача ${tasks[0].name} в ${tasks[0].time} ${tasks[0].date}`);
                        const executors = tasks.map(i => i.person)
                        const uniqueExecutors = [...new Set(executors)];
                        const foundedTasks = uniqueExecutors.reduce((acc,i,index)=> {
                        return acc + ` ${i.person}.`
                        },`Всего найдено исполнителей: ${uniqueExecutors.length}'. `)
                        console.log(tasks);
                        console.log(17);
                        console.log(foundedTasks);
                        return foundedTasks
                    } else {
                        return 'Задача не найдена'
                    }
                }
            }



            else if (LEMMACT[0] === 'добавь') {
                const missing_fields = [];
                if (!TASK) {
                    missing_fields.push("задача");
                }
                if (!DATE) {
                    missing_fields.push("дата");
                }
                if (!TIME) {
                    missing_fields.push("время");
                }
                if (!PER) {
                    missing_fields.push("пользователь");
                }
                if (missing_fields.length === 1 || missing_fields.length === 2) {
                    const answerToUser = missing_fields.reduce((acc, i) => {
                        return acc + ' ' + i
                    })
                    console.log(answerToUser);
                    return `Вы не указали поля ${answerToUser}`;
                } else if (missing_fields.length === 3) {
                    const answerToUser = missing_fields.reduce((acc, i, index) => {
                        if (index !== 2){   
                            return acc + ', ' + i
                        } else {
                            return acc + ' и ' + i
                        }
                    })
                    console.log(answerToUser);
                    return `Вы не указали поля ${answerToUser}`;

                } else if (missing_fields.length === 4) {

                    return "Вы не указали дату, время, исполнителя и название задачи";
                } else {
                    console.log(123)
                    // Добавляем задачу в базу данных для указанного пользователя на указанное время и дату
                    createUserTask(task);
                    return "Задача успешно добавлена";
                }
            }



            else if (LEMMACT[0] === "удаль") {
                console.log('UDALENIE V ROUTER');
                const missing_fields = [];
                if (!TASK) {
                    missing_fields.push("задача");
                }
                if (!DATE) {
                    missing_fields.push("дата");
                }
                if (!TIME) {
                    missing_fields.push("время");
                }
                if (!PER) {
                    missing_fields.push("пользователь");
                }

                if (missing_fields.length === 1 || missing_fields.length === 2) {
                    const answerToUser = missing_fields.reduce((acc, i) => {
                        return acc + ' ' + i
                    })
                    console.log(answerToUser);
                    return `Вы не указали поля ${answerToUser}`;
                } else if (missing_fields.length === 3) {
                    const answerToUser = missing_fields.reduce((acc, i, index) => {
                        if (index !== 2){   
                            return acc + ', ' + i
                        } else {
                            return acc + ' и ' + i
                        }
                    })
                    console.log(answerToUser);
                    return `Вы не указали поля ${answerToUser}`;

                } else if (missing_fields.length === 4) {

                    return "Вы не указали дату, время, исполнителя и название задачи";
                } else {
                    // Удаляем задачу из базы данных для указанного пользователя на указанное время и дату
                    deleteUserTask({...task, PER: ["я"]});
                    return "Задача успешно удалена";
                }
            }
            

            
            else if (LEMMACT[0] === 'изменить' || LEMMACT[0] === 'перенести') {
                console.log(213);
                console.log(LEMMACT[0]);
                const missing_fields = [];
                if (!TASK) {
                    missing_fields.push("задача");
                }
                if (!DATE) {
                    missing_fields.push("дата");
                }
                if (!TIME) {
                    missing_fields.push("время");
                }
                if (!PER) {
                    missing_fields.push("пользователь");
                }
                if (missing_fields.length === 1 || missing_fields.length === 2) {
                    const answerToUser = missing_fields.reduce((acc, i) => {
                        return acc + ' и ' + i
                    })
                    console.log(answerToUser);
                    return `Вы не указали поля ${answerToUser}`;
                } else if (missing_fields.length === 3) {
                    const answerToUser = missing_fields.reduce((acc, i, index) => {
                        if (index !== 2){   
                            return acc + ', ' + i
                        } else {
                            return acc + ' и ' + i
                        }
                    })
                    console.log(answerToUser);
                    return `Вы не указали поля ${answerToUser}`;

                } else if (missing_fields.length === 4) {

                    return "Вы не указали дату, время, исполнителя и название задачи";
                } else {
                    // Редактируем задачу в базе данных для указанного пользователя на указанное время и дату
                    console.log('ROUTER UPDATING');
                    updateTask(task);
                    return "Задача успешно отредактирована";
                }
            }



            // else if (LEMMACT[0] === 'перенести') {
            //     const missing_fields = [];
            //     if (!TASK) {
            //         missing_fields.push("задача");
            //     }
            //     if (!DATE) {
            //         missing_fields.push("дата");
            //     }
            //     if (!TIME) {
            //         missing_fields.push("время");
            //     }
            //     if (!PER) {
            //         missing_fields.push("пользователь");
            //     }
            //     if (missing_fields.length === 1 || missing_fields.length === 2) {
            //         const answerToUser = missing_fields.reduce((acc, i) => {
            //             return acc + ' и ' + i
            //         })
            //         console.log(answerToUser);
            //         return `Вы не указали поля ${answerToUser}`;
            //     } else if (missing_fields.length === 3) {
            //         const answerToUser = missing_fields.reduce((acc, i, index) => {
            //             if (index !== 2){   
            //                 return acc + ', ' + i
            //             } else {
            //                 return acc + ' и ' + i
            //             }
            //         })
            //         console.log(answerToUser);
            //         return `Вы не указали поля ${answerToUser}`;

            //     } else if (missing_fields.length === 4) {

            //         return "Вы не указали дату, время, исполнителя и название задачи";
            //     } else {
            //         console.log('PODVIGAEDM TASK V ROUTERE');
            //         moveTask({...task, PER: ["я"]});
            //         return "Задача успешно перенесена";
                    
            //     }
            // }

            // else if (LEMMACT[0] === 'добавить пользователя') {
            //     if (PER) {
            //         // Добавляем нового пользователя в базу данных
            //         addUserToDatabase(PER);
            //     } else {
            //         return "Не указаны все необходимые параметры для добавления пользователя";
            //     }
            // } 
            
            // else if (LEMMACT[0] === 'удалить пользователя') {
            //     if (PER) {
            //         // Удаляем пользователя из базы данных
            //         deleteUserFromDatabase(PER);
            //     } else {
            //         return "Не указаны все необходимые параметры для удаления пользователя";
            //     }
            // } 
            
            // else if (LEMMACT[0] === 'редактировать пользователя') {
            //     if (PER && new_person) {
            //         // Редактируем информацию о пользователе в базе данных
            //         editUserInDatabase(PER, new_person);
            //     } else {
            //         return "Не указаны все необходимые параметры для редактирования пользователя";
            //     }
            // } 
            
            else {
                return `Неизвестное действие ${LEMMACT}` ;
            }
        }

    }) // Добавьте остальные ветвления в соответствии с вашими условиями

    console.log('Выполнено общих задач после разбития на предложения');
    console.log(foundedTasks);

    const stringAnswer = foundedTasks.reduce((acc,i,index): string => {
        return acc + ` по ${getNumeralCase(index)} задаче: ` + i + '.'
    }, '')

    console.log(stringAnswer)

    if (foundedTasks.length > 0) {
        return stringAnswer ? stringAnswer : 'нет задач'
    } else {
        return 'задач не найдено'
    }




}
