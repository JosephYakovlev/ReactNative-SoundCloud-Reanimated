//Actions.js
import { parseISO, addDays, addWeeks, addMonths, addYears, addHours, startOfISOWeek, endOfISOWeek, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, startOfYear, endOfYear  } from 'date-fns';
import Realm from 'realm';
import {User, Task} from './UserModel';
import Fuse from 'fuse.js'

import { newTimeFutureParser, newTimeFuturePastParser } from './TimeParsers';
import { newDateFutureParser, newDateFuturePastParser } from './DateParsers';
import { iData, iIncomeComandInterface, iTask, iIncomeCreateTasksCommand, iIncomeUpdateTasksCommand } from './Interfaces';

const realmConfig = {
  schema: [User, Task],
};
const realm = new Realm(realmConfig);

export function createUserTask(newTask: iIncomeCreateTasksCommand) {

    console.log(213123)
    console.log(newTask);
    const todayDate = new Date()

    const {ACT,DATE,TIME,TASK,PER,LEMMACT,LEMMDATE,LEMMTIME,LEMMTASK,LEMMPER,PREFIX,LEMMPREFIX} = newTask

    let inputTime = LEMMTIME ? LEMMTIME[0] : 'no'
    let lemmInputDays = LEMMDATE ? LEMMDATE[0] : 'no'
    const hasHour = ['час', 'часы'].some(word => inputTime.includes(word));
    const hasMinute = ['минута', 'минуты'].some(word => inputTime.includes(word));
    const hasDay = ['день', 'дни'].some(word => lemmInputDays.includes(word));
    const hasWeek = ['неделя', 'недели'].some(word => lemmInputDays.includes(word));
    const hasMonth = ['месяц', 'месяцы'].some(word => lemmInputDays.includes(word));
    const hasYear = ['год', 'лет'].some(word => lemmInputDays.includes(word));



    const newDateFuture = newDateFutureParser(DATE ? DATE[0] : todayDate.toISOString(), LEMMPREFIX ? LEMMPREFIX[0] : 'нет префикса', hasDay, hasWeek, hasMonth, hasYear)
    console.log('DATE');
    console.log(newDateFuture);
    
    const newTimeFuture = newTimeFutureParser(LEMMTIME ? LEMMTIME[0] : null, newDateFuture, LEMMDATE ? LEMMDATE[0] : lemmInputDays, LEMMPREFIX ? LEMMPREFIX[0] : 'нет префикса', hasHour, hasMinute)

    console.log('TIME');
    console.log(newTimeFuture);
    console.log('TIME2');
    console.log(typeof newTimeFuture);
    
    console.log(newDateFuture);
    


    realm.write(() => {
        // Создаем новую задачу в базе данных
        const users: any = realm.objects('User').sorted('id', true);
        console.log('users in createUserTask ( 186 str)');
        console.log(users);
        const newId = users.length > 0 ? users[0].id + 1 : 1;
        const fakeTasks = [
            { id: 1, description: 'Task 1' },
            { id: 2, description: 'Task 2' },
        ]

        console.log(newTask)
        const formedTask = {
            id: newId,
            name: newTask.TASK[0],
            person: newTask.TASK ? newTask.TASK[0] : 'я',
            date: newTimeFuture,
            time: newTimeFuture,
            lemmaName: newTask.LEMMTASK[0],
            lemmaPerson: newTask.TASK ? newTask.TASK[0] : 'я',
            lemmaDate: newTimeFuture,
            lemmaTime: newTimeFuture,
            tasks: fakeTasks
        }

        const a = realm.create('User', formedTask);
        console.log(a);
        console.log('Добавлена');
        return 'задание добавлено'
    });
}


export function getTasks(newTask: iIncomeComandInterface): Array<iData> {

    console.log("ИЩЕМ ЗАДАНИЕ B ACTIONS")
    console.log(newTask)
  
    const {DATE,TIME,TASK,PER,LEMMDATE,LEMMTIME,LEMMTASK,LEMMPER, CREATE,PREFIX,LEMMPREFIX} = newTask
    console.log(234234);
    
    let inputTime = LEMMTIME ? LEMMTIME[0] : 'no'
    let inputHours = LEMMDATE ? LEMMDATE[0] : 'no'


    const hasHour = ['час', 'часы'].some(word => inputTime.includes(word));
    const hasMinute = ['минута', 'минуты'].some(word => inputTime.includes(word));
    const hasDay = ['день', 'дни'].some(word => inputHours.includes(word));
    const hasWeek = ['неделя', 'недели'].some(word => inputHours.includes(word));
    const hasMonth = ['месяц', 'месяцы'].some(word => inputHours.includes(word));
    const hasYear = ['год', 'лет'].some(word => inputHours.includes(word));



    let data: iData[] = []
    let lemmaData: iData[] = []

    let filteredData: iData[] = []
    let filteredLemmaData: iData[] = []

    const tasksFromDB: Array<iData> = Array.from(realm.objects('User'));

    tasksFromDB.forEach((i: iData) => {
        data.push(i);
        lemmaData.push(i);
    });
    
    if(PER) {
        console.log("filtering PER")
        const queryPer = PER[0];
        console.log(`queryPer = ${queryPer}`)
        const lemmQueryPer = LEMMPER ? LEMMPER[0] : PER[0]
        console.log(`lemmQueryPer = ${lemmQueryPer}`)

        const persons = tasksFromDB.map(item => item.person);
        console.log('persons');
        console.log(persons);
        const lemmaPerson = tasksFromDB.map(item => item.lemmaPerson);
        console.log('lemmaPersons');
        console.log(lemmaPerson);
        const options = {
            includeScore: true,  // Включить оценку схожести
            threshold: 0.3,      // Порог схожести (меньше - более строгий)
        };
        const fusePer = new Fuse(persons, options)
        console.log('fuse persons');
        console.log(fusePer);
        const fuseLemmaPer = new Fuse(lemmaPerson, options)
        console.log('fuse lemm persons');
        console.log(fuseLemmaPer);

        const searchResults = fusePer.search(queryPer);
        console.log('searchRes');
        console.log(searchResults);
        const searchLemmaResults = fuseLemmaPer.search(lemmQueryPer);
        console.log('search LemRes');
        console.log(searchLemmaResults);

        const searchResultsItems = searchResults.map(i => i.item)
        console.log('searchResultsItems');
        console.log(searchResultsItems);
        const searchLemmaResultsItems = searchLemmaResults.map(i=> i.item)
        console.log('searchLemmaResultsItems');
        console.log(searchLemmaResultsItems);


        const uniqueResultsSet = [...new Set(searchResultsItems)];
        console.log('uniq res');
        console.log(uniqueResultsSet);
        const uniqueLemmaResultsSet = [...new Set(searchLemmaResultsItems)];
        console.log('uniq lemma res');
        console.log(uniqueLemmaResultsSet);

        let newDataForPer: Array<iData> = []
        let newLemmaDataForPer: Array<iData> = []
       
        uniqueResultsSet.forEach(result => {
            
            const dataFromDB = data.filter((i: iData) => 
                i.person.includes(result)
            )
            dataFromDB.forEach((i: iData) => 
                newDataForPer.push(i)
            )
        })

        uniqueLemmaResultsSet.forEach(result => {
            
            const lemmaDataFromDB = lemmaData.filter((i: iData) => 
                i.lemmaPerson.includes(result)
            )
            lemmaDataFromDB.forEach((i: iData) => 
                newLemmaDataForPer.push(i)
            )
        })
    
        filteredData = newDataForPer
        filteredLemmaData = newLemmaDataForPer


        console.log('END PER FILTER');
        console.log(data);
        console.log('END LEMMAPER FILER');
        console.log(lemmaData);
    } else {


        console.log('END NO PER FILTER');
        console.log(data);
        console.log('END NO LEMMAPER FILER');
        console.log(lemmaData);
    }


    if(TASK) {
        console.log("filtering TASK")
        const queryTASK = TASK[0];
        console.log(`queryTASK = ${queryTASK}`)
        const lemmQueryTASK = LEMMTASK ? LEMMTASK[0] : TASK[0]
        console.log(`lemmQueryTASK = ${lemmQueryTASK}`)

        const tasks = data.map(item => item.name);
        const lemmaTasks = lemmaData.map(item => item.lemmaName);

        const options = {
            includeScore: true,  // Включить оценку схожести
            threshold: 0.3,      // Порог схожести (меньше - более строгий)
        };
        const fusePer = new Fuse(tasks, options)
        const fuseLemmaPer = new Fuse(lemmaTasks, options)

        const searchResults = fusePer.search(queryTASK);
        const searchLemmaResults = fuseLemmaPer.search(lemmQueryTASK);

        const searchResultsItems = searchResults.map(i => i.item)
        console.log('searchResultsItems');
        console.log(searchResultsItems);
        const searchLemmaResultsItems = searchLemmaResults.map(i=> i.item)
        console.log('searchLemmaResultsItems');
        console.log(searchLemmaResultsItems);


        const uniqueResultsSet = [...new Set(searchResultsItems)];
        console.log('uniq res');
        console.log(uniqueResultsSet);
        const uniqueLemmaResultsSet = [...new Set(searchLemmaResultsItems)];
        console.log('uniq lemma res');
        console.log(uniqueLemmaResultsSet);


        let newDataForPer: Array<iData> = []
        let newLemmaDataForPer: Array<iData> = []

        uniqueResultsSet.forEach(result => {
            
            const dataFromDB = data.filter((i: iData) => 
                i.name.includes(result)
            )
            dataFromDB.forEach((i: iData) => 
                newDataForPer.push(i)
            )
        })

        uniqueLemmaResultsSet.forEach(result => {
            
            const lemmaDataFromDB = lemmaData.filter((i: iData) => 
                i.lemmaName.includes(result)
            )
            lemmaDataFromDB.forEach((i: iData) => 
                newLemmaDataForPer.push(i)
            )
        })

        filteredData = newDataForPer
        filteredLemmaData = newLemmaDataForPer

        console.log('END TASK FILTER');
        console.log(data);
        console.log('END LEMMATASK FILER');
        console.log(lemmaData);
    } else {
        console.log('END NO TASK FILTER');
    }

    if(TIME) {
        const today = new Date()
        const newTimeFuture = newTimeFutureParser(LEMMTIME ? LEMMTIME[0] : null, DATE ? DATE[0] : today.toISOString(), LEMMDATE ? LEMMDATE[0] : 'no', LEMMPREFIX ? LEMMPREFIX[0] : 'нет префикса', hasHour, hasMinute)

        if(CREATE) {
            console.log("filtering TIME CREATE")

            const newTimes: Array<iData> = data.filter(i => i.createdAt.includes(newTimeFuture.substring(9, 13)));
            const newTimesLemma: Array<iData> = lemmaData.filter(i => i.createdAt.includes(newTimeFuture.substring(9, 13)));


            filteredData = newTimes
            filteredLemmaData = newTimesLemma

            console.log('END TIME FILTER');
            console.log(data);
            console.log('END LEMMATIME FILER');
            console.log(lemmaData);

        } else {    
            console.log("filtering TIME NOT CREATE")

            const newTimes: Array<iData> = data.filter(i => i.time.includes(newTimeFuture.substring(9, 13)));
            const newTimesLemma: Array<iData> = lemmaData.filter(i => i.time.includes(newTimeFuture.substring(9, 13)));

            filteredData = newTimes
            filteredLemmaData = newTimesLemma

            console.log('END TIME FILTER');
            console.log(data);
            console.log('END LEMMATIME FILER');
            console.log(lemmaData);
        }
    } else {
        console.log('END NO TIME FILTER');
    }


    if(LEMMDATE) {
            const initialDate = DATE ? DATE : LEMMDATE
            
            const newDateFuture = newDateFutureParser(initialDate[0], LEMMPREFIX ? LEMMPREFIX[0] : 'нет префикса', hasDay, hasWeek, hasMonth, hasYear)
           

            const LEMMAPREFIX = LEMMPREFIX ? LEMMPREFIX[0] : 'no'

            if (LEMMDATE.includes('неделя')) {
                const initialDate = parseISO(newDateFuture);
                const today = new Date();
                const startWeekDate = ['следующие', 'ближайшие'].some(substring => LEMMAPREFIX.includes(substring))
                    ? today
                    : startOfISOWeek(initialDate);
                const endWeekDate = endOfISOWeek(initialDate);
                const daysInRange = eachDayOfInterval({
                    start: startWeekDate,
                    end: endWeekDate,
                });
            
                const IsoDaysInRange: Array<string> = daysInRange.map(i => i.toISOString());
            
                const newTimes: Array<iData> = data.filter((i: iData) =>  
                    IsoDaysInRange.some((d: string) => CREATE ? i.createdAt.includes(d.substring(0, 10)) : i.time.includes(d.substring(0, 10)))
                );
                const newTimesLemma: Array<iData> = lemmaData.filter((i: iData) =>  
                    IsoDaysInRange.some((d: string) => CREATE ? i.createdAt.includes(d.substring(0, 10)) : i.time.includes(d.substring(0, 10)))
                );
                filteredData = newTimes
                filteredLemmaData = newTimesLemma

                console.log('nEWTIMES NEDELYA');
                console.log(newTimes);
            } else if (LEMMDATE.includes('месяц')) {
                const initialDate = parseISO(newDateFuture);
                const today = new Date();
                const startMonthDate = ['следующие', 'ближайшие'].some(substring => LEMMAPREFIX.includes(substring))
                    ? today
                    : startOfMonth(initialDate);
                const endMonthDate = endOfMonth(initialDate);
                const daysInRange = eachDayOfInterval({
                    start: startMonthDate,
                    end: endMonthDate,
                });
                const IsoDaysInRange: Array<string> = daysInRange.map(i => i.toISOString());
                const newTimes: Array<iData> = data.filter((i: iData) =>
                    IsoDaysInRange.some((d: string) => CREATE ? i.createdAt.includes(d.substring(0, 10)) : i.time.includes(d.substring(0, 10)))
                );
                const newTimesLemma: Array<iData> = lemmaData.filter((i: iData) =>  
                    IsoDaysInRange.some((d: string) => CREATE ? i.createdAt.includes(d.substring(0, 10)) : i.time.includes(d.substring(0, 10)))
                );
                filteredData = newTimes
                filteredLemmaData = newTimesLemma
            
                console.log('newTimes Месяц');
                console.log(newTimes);
            } else if (LEMMDATE.includes('год')) {
                const initialDate = parseISO(newDateFuture);
                const today = new Date();
                const startYearDate = ['следующие', 'ближайшие'].some(substring => LEMMAPREFIX.includes(substring))
                    ? today
                    : startOfYear(initialDate);
                const endYearDate = endOfYear(initialDate);
                const daysInRange = eachDayOfInterval({
                    start: startYearDate,
                    end: endYearDate,
                });
            
                const IsoDaysInRange: Array<string> = daysInRange.map(i => i.toISOString());
            
                const newTimes: Array<iData> = data.filter((i: iData) =>  
                    IsoDaysInRange.some((d: string) => CREATE ? i.createdAt.includes(d.substring(0, 10)) : i.time.includes(d.substring(0, 10)) )
                );

                const newTimesLemma: Array<iData> = lemmaData.filter((i: iData) =>  
                    IsoDaysInRange.some((d: string) => CREATE ? i.createdAt.includes(d.substring(0, 10)) : i.time.includes(d.substring(0, 10)))
                );
                filteredData = newTimes
                filteredLemmaData = newTimesLemma

                console.log('NewTimes Год');
                console.log(newTimes);
            } else {
                console.log('NewTimes на дату');
                
                const newTimes: Array<iData> = data.filter(i => CREATE ? i.createdAt.includes(newDateFuture.substring(0, 10)) : i.time.includes(newDateFuture.substring(0, 10)));
                const newTimesLemma: Array<iData> = lemmaData.filter(i => CREATE ? i.createdAt.includes(newDateFuture.substring(0, 10)) : i.time.includes(newDateFuture.substring(0, 10)));


                filteredData = newTimes
                filteredLemmaData = newTimesLemma
            }

            console.log('END DATE FILTER');
            console.log(filteredData);
            console.log('END LEMMADATE FILER');
            console.log(lemmaData);

    }  else {
            // console.log("filtering !DATE")
            // console.log('NewTimes нет дату');
            // const InitialDate = new Date()
                
            // const newTimes: Array<iData> = data.filter(i => CREATE ? i.createdAt.includes(InitialDate.toISOString().substring(0, 10)) : i.time.includes(InitialDate.toISOString().substring(0, 10)));
            // const newTimesLemma: Array<iData> = lemmaData.filter(i => CREATE ? i.createdAt.includes(InitialDate.toISOString().substring(0, 10)) : i.time.includes(InitialDate.toISOString().substring(0, 10)));

            // data = newTimes
            // lemmaData = newTimesLemma
            console.log('END DATE FILTER');
            console.log(data);
            console.log('END LEMMADATE FILER');
            console.log(lemmaData);
    }

    if(filteredData > filteredLemmaData) {
            console.log('DATA BOLWE');
            console.log(data.length);
            console.log(lemmaData.length);
            return filteredData
    } else {
            console.log('LEMMADATA BOLWE');
            console.log(lemmaData.length);
            console.log(data.length);
            return filteredLemmaData
    }

}



export function deleteUserTask(newTask: iIncomeComandInterface) {

    console.log('UDALENIE V ACTIONS');

    const tasksToDelete = getTasks(newTask)

    console.log(tasksToDelete);
    if (tasksToDelete.length > 0) {
        realm.write(() => {
            realm.delete(tasksToDelete);
        });
        console.log('Удалено');
        return 'задание удалено'
    } else {
        console.log('Задача не найдена. Не удалось удалить задачу. в ACTIONS');
        return 'Задача не найдена. Не удалось удалить задачу.'
    }
}



export function updateTask(newTask: iIncomeUpdateTasksCommand) {

    console.log("ACTIONS UPDATING");
 
    const {ACT,DATE,TIME,TASK,PER,LEMMACT,LEMMDATE,LEMMTIME,LEMMTASK,LEMMPER,PREFIX,LEMMPREFIX} = newTask

    let inputTime = LEMMTIME ? LEMMTIME[0] : 'no'
    let inputHours = LEMMDATE ? LEMMDATE[0] : 'no'


    const hasHour = ['час', 'часы'].some(word => inputTime.includes(word));
    const hasMinute = ['минута', 'минуты'].some(word => inputTime.includes(word));
    const hasDay = ['день', 'дни'].some(word => inputHours.includes(word));
    const hasWeek = ['неделя', 'недели'].some(word => inputHours.includes(word));
    const hasMonth = ['месяц', 'месяцы'].some(word => inputHours.includes(word));
    const hasYear = ['год', 'лет'].some(word => inputHours.includes(word));

    let data: iData[] = []

    const PREFFORSEARCH = (DATE.length > 1 && TIME.length > 1) ? 'нет префикса' : PREFIX ? PREFIX[0] : 'нет префикса'
    const PREFLEMMFORSEARCH = (DATE.length > 1 && TIME.length > 1) ? 'нет префикса' : LEMMPREFIX ? LEMMPREFIX[0] : 'нет префикса'

    const tasksFromDB: Array<iData> = getTasks({...newTask, PREFIX: [PREFFORSEARCH] , LEMMPREFIX: [PREFLEMMFORSEARCH]  })

    tasksFromDB.forEach((i: iData) => {
        data.push(i);
    });

    if (data.length < 1) {
        return 'задач не найдено'
    }

    if (DATE.length == 1 && TIME.length == 1 && TASK.length == 1 && PER.length == 1) {
        return `${data.length} ${data.length === 1 ? 'задача оставлена без изменений' : (data.length >= 2 && data.length <= 4) ? 'задачи оставлены без изменений' : 'задач оставлено  без измененийввв'}`;
    }

    realm.write(() => {
        // Изменяем свойства объектов, как вам необходимо
        data.forEach(task => {
                task.date = DATE.length > 1 ? newDateFuturePastParser(DATE[1], LEMMPREFIX ? LEMMPREFIX[0] : 'нет префикса', hasDay, hasWeek, hasMonth, hasYear) : task.date; // замените на новое значение
                task.time = TIME.length > 1 ? newTimeFuturePastParser(TIME[1], task.date, task.lemmaDate, LEMMPREFIX ? LEMMPREFIX[0] : 'нет префикса', hasHour, hasMinute,) : task.time;
                task.name = TASK.length > 1 ? TASK[1] : task.name;
                task.person = PER.length > 1 ? PER[1] : task.person;
                // замените на новое значение
                // ... другие изменения
        });
    });

    return `${data.length} ${data.length === 1 ? ' задача обновлена' : (data.length >= 2 && data.length <= 4) ? ' задачи обновлены' : ' задач обновлено'}`;
}


export function deleteAllUsers() {
  realm.write(() => {
    const allUsers = realm.objects('User');
    realm.delete(allUsers)
  });
}


export function moveTask(newTask) {

    const {DATE,TIME,TASK,PER} = newTask

    const tasksToMove = realm.objects('User').filtered('name == $0 AND date == $1 AND time == $2 AND person == $3', TASK[0], DATE[0], TIME[0], PER[0]);

    if (tasksToMove.length > 0) {

        if(PER.length === 0 ){
            if (PREFIX[0]==='через' || PREFIX[0]==='позже' || PREFIX[0]==='вперед') {
                tasksToMove.map((i)=>{
                    realm.write(() => {
                        if (DATE.length > 1 && TIME.length > 1) {
                            console.log('BOTH');
                            console.log(DATE[1]);
                            i.date = DATE[1] + 2;
                            i.time = TIME[1];
                        } else if (DATE.length > 0 && TIME.length < 1) {
                            i.date = DATE[1] + 2;
                            i.time = TIME[0];
                        } else if (DATE.length < 1 && TIME.length > 0) {
                            i.date = TIME[1] + 2;
                            i.time = DATE[0];
                        } else {
                            i.date = DATE[0];
                            i.time = TIME[0];
                        }
                
                        // i.PER = PER;
                    });
                })
            } else if (PREFIX[0]==='раньше' || PREFIX[0]==='назад' || PREFIX[0]==='вперед') {
                tasksToMove.map((i)=>{
                    realm.write(() => {
                        if (DATE.length > 1 && TIME.length > 1) {
                            console.log('BOTH');
                            console.log(DATE[1]);
                            i.date = DATE[1] - 2;
                            i.time = TIME[1];
                        } else if (DATE.length > 0 && TIME.length < 1) {
                            i.date = DATE[1] - 2;
                            i.time = TIME[0];
                        } else if (DATE.length < 1 && TIME.length > 0) {
                            i.date = TIME[1] - 2;
                            i.time = DATE[0];
                        } else {
                            i.date = DATE[0];
                            i.time = TIME[0];
                        }
                
                        // i.PER = PER;
                    });
                })
            } else {
                tasksToMove.map((i)=>{
                    realm.write(() => {
                        if (DATE.length > 1 && TIME.length > 1) {
                            console.log('BOTH');
                            console.log(DATE[1]);
                            i.date = DATE[1] + 2;
                            i.time = TIME[1];
                        } else if (DATE.length > 0 && TIME.length < 1) {
                            i.date = DATE[1] + 2;
                            i.time = TIME[0];
                        } else if (DATE.length < 1 && TIME.length > 0) {
                            i.date = TIME[1] + 2;
                            i.time = DATE[0];
                        } else {
                            i.date = DATE[0];
                            i.time = TIME[0];
                        }
                
                        // i.PER = PER;
                    });
                })
            }
        } else {

            tasksToMove.map((i)=>{
                realm.write(() => {
                    if (DATE.length > 1 && TIME.length > 1) {
                        console.log('BOTH')
                        console.log(DATE[1])
                        i.date = DATE[1]
                        i.time = TIME[1]
                        i.person = 'я'
                    } else if (DATE.length > 1 && TIME.length === 1) {
                        i.date = DATE[1]
                        i.time = TIME[0]
                        i.person = 'я'
                    } else if (DATE.length === 1 && TIME.length > 1) {
                        i.date = TIME[1]
                        i.time = DATE[0]
                        i.person = 'я'
                    } else {
                        i.date = DATE[0]
                        i.time = TIME[0]
                        i.person = 'я'
                    }
                    // i.PER = PER;
                });
            })
        }



        console.log('pereneseno v ACTIONS')
        return 'перенесено'

} else {
    return 'Задача не найдена. Не удалось перенести задачу.'
}

}


// if (DATE === 'неделя') {
//     if (['через', 'позже', 'вперед', 'следующий'].includes(PREFIX)) {
//         return calculateFutureDate(parseInt(7))
//     } else {
//         return DATE[0];
//     }
// } else if (DATE === 'месяц') {
//     if (['через', 'позже', 'вперед'].includes(PREFIX)) {
//         const now = new Date();
//         now.setMonth(now.getMonth() + 1);
//         const dnow = now.toISOString();
//         console.log(dnow);
        
//         return calculateFutureDate(31)
//     } else {
//         return DATE[0];
//     }
// }else if (DATE === 'год') {
//     if (['через', 'позже', 'вперед'].includes(PREFIX)) {
//         const now = new Date();
//         now.setFullYear(now.getFullYear() + 1);
//         return now.toISOString();
//     } else {
//         return DATE[0];
//     }
// } else {
