//Actions.js
import { parseISO, addDays, addWeeks, addMonths, addYears, addHours, startOfISOWeek, endOfISOWeek, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, startOfYear, endOfYear  } from 'date-fns';
import Realm from 'realm';
import {User, Task} from './UserModel';
import Fuse from 'fuse.js'

import { newTimeFutureParser } from './TimeParsers';
import { newDateFutureParser } from './DateParsers';
import { iData, iIncomeComandInterface, iTask } from './Interfaces';

const realmConfig = {
  schema: [User, Task],
};
const realm = new Realm(realmConfig);

const TimeArrayOne = ['завтра', 'послезавтра', 'понедельник', 'вторник', 'среда', 
                      'четверг', 'пятница', 'суббота', 'воскресенье',  'январь', 'февраль', 
                      'март', 'апрель', 'май', 'июнь','июль', 'август', 'сентябрь', 'октябрь', 
                      'ноябрь', 'декабрь','следующий' ]

export function createUserTask(newTask: iIncomeComandInterface) {

    console.log(213123)
    console.log(newTask);

    const {ACT,DATE,TIME,TASK,PER,LEMMACT,LEMMDATE,LEMMTIME,LEMMTASK,LEMMPER,PREFIX,LEMMPREFIX} = newTask

    let inputTime = LEMMTIME[0]
    let inputHours = LEMMDATE[0]
    const hasHour = ['час', 'часы'].some(word => inputTime.includes(word));
    const hasMinute = ['минута', 'минуты'].some(word => inputTime.includes(word));
    const hasDay = ['день', 'дни'].some(word => inputHours.includes(word));
    const hasWeek = ['неделя', 'недели'].some(word => inputHours.includes(word));
    const hasMonth = ['месяц', 'месяцы'].some(word => inputHours.includes(word));
    const hasYear = ['год', 'лет'].some(word => inputHours.includes(word));



    const newDateFuture = newDateFutureParser(DATE[0], LEMMPREFIX ? LEMMPREFIX : 'нет префикса', hasDay, hasWeek, hasMonth, hasYear)
    console.log('DATE');
    console.log(newDateFuture);
    
    const newTimeFuture = newTimeFutureParser(LEMMTIME, newDateFuture, LEMMDATE, LEMMPREFIX ? LEMMPREFIX : 'нет префикса', hasHour, hasMinute)

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
            person: newTask.PER[0],
            date: newTimeFuture,
            time: newTimeFuture,
            lemmaName: newTask.LEMMTASK[0],
            lemmaPerson: newTask.LEMMPER[0],
            lemmaDate: newTask.LEMMDATE[0],
            lemmaTime: newTask.LEMMTIME[0],
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
    
    let inputTime = LEMMTIME[0]
    let inputHours = LEMMDATE[0]
    const hasHour = ['час', 'часы'].some(word => inputTime.includes(word));
    const hasMinute = ['минута', 'минуты'].some(word => inputTime.includes(word));
    const hasDay = ['день', 'дни'].some(word => inputHours.includes(word));
    const hasWeek = ['неделя', 'недели'].some(word => inputHours.includes(word));
    const hasMonth = ['месяц', 'месяцы'].some(word => inputHours.includes(word));
    const hasYear = ['год', 'лет'].some(word => inputHours.includes(word));

    const newDateFuture = newDateFutureParser(DATE[0], LEMMPREFIX ? LEMMPREFIX : 'нет префикса', hasDay, hasWeek, hasMonth, hasYear)
    console.log('DATE');
    console.log(newDateFuture);
    
    const newTimeFuture = newTimeFutureParser(LEMMTIME, newDateFuture, LEMMDATE, LEMMPREFIX ? LEMMPREFIX : 'нет префикса', hasHour, hasMinute)

    console.log('TIME');
    console.log(newTimeFuture);
    console.log('TIME2');
    console.log(typeof newTimeFuture);
    
    console.log(newDateFuture);


    let data: iData[] = []
    let lemmaData: iData[] = []

    const tasksFromDB: Array<iData> = Array.from(realm.objects('User'));

    tasksFromDB.forEach((i: iData) => {
        data.push(i);
        lemmaData.push(i);
    });
    
    if(PER) {
        console.log("filtering PER")
        const queryPer = PER[0];
        console.log(`queryPer = ${queryPer}`)
        const lemmQueryPer = LEMMPER[0]
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
    
        data = newDataForPer
        lemmaData = newLemmaDataForPer


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
        const lemmQueryTASK = LEMMTASK[0]
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

        data = newDataForPer
        lemmaData = newLemmaDataForPer

        console.log('END TASK FILTER');
        console.log(data);
        console.log('END LEMMATASK FILER');
        console.log(lemmaData);
    } else {
        console.log('END NO TASK FILTER');
    }

    if(TIME) {
        if(CREATE) {
            console.log("filtering TIME CREATE")

            const newTimes: Array<iData> = data.filter(i => i.createdAt.includes(newTimeFuture.substring(0, 13)));
            const newTimesLemma: Array<iData> = lemmaData.filter(i => i.createdAt.includes(newTimeFuture.substring(0, 13)));


            data = newTimes
            lemmaData = newTimesLemma

            console.log('END TIME FILTER');
            console.log(data);
            console.log('END LEMMATIME FILER');
            console.log(lemmaData);

        } else {    
            console.log("filtering TIME NOT CREATE")

            const newTimes: Array<iData> = data.filter(i => i.time.includes(newTimeFuture.substring(0, 13)));
            const newTimesLemma: Array<iData> = lemmaData.filter(i => i.time.includes(newTimeFuture.substring(0, 13)));

            data = newTimes
            lemmaData = newTimesLemma

            console.log('END TIME FILTER');
            console.log(data);
            console.log('END LEMMATIME FILER');
            console.log(lemmaData);
        }
    } else {
        console.log('END NO TIME FILTER');
    }


        if(DATE) {

            if (LEMMDATE.includes('неделя')) {
                const initialDate = parseISO(newTimeFuture);
                const today = new Date();
                const startWeekDate = ['следующие', 'ближайшие'].some(substring => LEMMPREFIX.includes(substring))
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
                data = newTimes
                lemmaData = newTimesLemma

                console.log('nEWTIMES NEDELYA');
                console.log(newTimes);
            } else if (LEMMDATE.includes('месяц')) {
                const initialDate = parseISO(newTimeFuture);
                const today = new Date();
                const startMonthDate = ['следующие', 'ближайшие'].some(substring => LEMMPREFIX.includes(substring))
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
                data = newTimes
                lemmaData = newTimesLemma
            
                console.log('newTimes Месяц');
                console.log(newTimes);
            } else if (LEMMDATE.includes('год')) {
                const initialDate = parseISO(newTimeFuture);
                const today = new Date();
                const startYearDate = ['следующие', 'ближайшие'].some(substring => LEMMPREFIX.includes(substring))
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
                data = newTimes
                lemmaData = newTimesLemma

                console.log('NewTimes Год');
                console.log(newTimes);
            } else {
                console.log('NewTimes на дату');
                
                const newTimes: Array<iData> = data.filter(i => CREATE ? i.createdAt.includes(newTimeFuture.substring(0, 10)) : i.time.includes(newDateFuture.substring(0, 10)));
                const newTimesLemma: Array<iData> = lemmaData.filter(i => CREATE ? i.createdAt.includes(newTimeFuture.substring(0, 10)) : i.time.includes(newDateFuture.substring(0, 10)));


                data = newTimes
                lemmaData = newTimesLemma
            }

            console.log('END DATE FILTER');
            console.log(data);
            console.log('END LEMMADATE FILER');
            console.log(lemmaData);

        }  else {
            console.log("filtering !DATE")
            console.log('NewTimes нет дату');
            const InitialDate = new Date()
                
            const newTimes: Array<iData> = data.filter(i => CREATE ? i.createdAt.includes(InitialDate.toISOString().substring(0, 10)) : i.time.includes(InitialDate.toISOString().substring(0, 10)));
            const newTimesLemma: Array<iData> = lemmaData.filter(i => CREATE ? i.createdAt.includes(InitialDate.toISOString().substring(0, 10)) : i.time.includes(InitialDate.toISOString().substring(0, 10)));

            data = newTimes
            lemmaData = newTimesLemma
            console.log('END DATE FILTER');
            console.log(data);
            console.log('END LEMMADATE FILER');
            console.log(lemmaData);
        }

        if(data > lemmaData) {
            console.log('DATA BOLWE');
            console.log(data.length);
            console.log(lemmaData.length);
            return data
        } else {
            console.log('LEMMADATA BOLWE');
            console.log(lemmaData.length);
            console.log(data.length);
            return lemmaData
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





export function updateTask(newTask) {

    console.log("ACTIONS UPDATING");
    const {DATE,TIME,TASK,PER} = newTask

    const tasksToUpdate = realm.objects('User').filtered('name == $0 AND date == $1 AND time == $2 AND person == $3', TASK[0], DATE[0], TIME[0], PER[0]);

    const hasDay = ['день'].includes(inputText);
    const daysMatch = inputText.match(/(\d+)\s+дней?/);

    function calculateFutureDate(days) {
        const currentDate = new Date();
        const futureDate = new Date(currentDate);
        futureDate.setDate(currentDate.getDate() + days);
        return futureDate.toISOString();
    }

    function calculatePastDate(days) {
        const currentDate = new Date();
        const pastDate = new Date(currentDate);
        pastDate.setDate(currentDate.getDate() - days);
        return pastDate.toISOString();
    }

    const newTime = (taskTime) => (
        DATE 
        ?
            (TIME ? TIME : taskTime)
        : 
            (   
                TIME
                ?
                    (['через', 'позже', 'вперед'].includes(PREFIX) && '+2') ||
                    (['назад', 'раньше'].includes(PREFIX) && '-2') ||
                    (['следующий', 'последующий'].includes(PREFIX) && 'right now') ||
                    TIME[0]
                :
                taskTime
            )
    );

    // const newDate = (taskTime) => (
        
    //     DATE
    //     ? 
    //         (DATE === 'неделя' || DATE === 'месяц')
    //         ?
    //             (['через', 'позже', 'вперед'].includes(PREFIX) && '+2') ||
    //             (['назад', 'раньше'].includes(PREFIX) && '-2') ||
    //             (['следующий', 'последующий'].includes(PREFIX) && 'right now') ||
    //             DATE[0]
    //         :
            
    //             hasDay
    //             ?
    //                 (['назад', 'раньше'].includes(PREFIX) && calculatePastDate(parseInt(daysMatch[0]))) ||
    //                 calculateFutureDate(parseInt(daysMatch[0]))
    //             :
    //                 (['через', 'позже', 'вперед'].includes(PREFIX) && '+2') ||
    //                 (['назад', 'раньше'].includes(PREFIX) && '-2') ||
    //                 (['следующий', 'последующий'].includes(PREFIX) && 'right now') ||
    //                 DATE[0]// Вывести false, так как ни количество дней, ни 'день' не найдены
                
    //         :
    //     taskDate
    // );

    const newDate = (taskTime) => {
        if (DATE) {
            if (DATE === 'неделя') {
                if (['через', 'позже', 'вперед'].includes(PREFIX)) {
                    return calculateFutureDate(parseInt(7))
                } else if (['назад', 'раньше'].includes(PREFIX)) {
                    return calculatePastDate(parseInt(7));
                } else {
                    return DATE[0];
                }
            } else if (DATE === 'месяц') {
                if (['через', 'позже', 'вперед'].includes(PREFIX)) {
                    return calculateFutureDate(31)
                } else if (['назад', 'раньше'].includes(PREFIX)) {
                    return '-2';
                } else {
                    return DATE[0];
                }
            } else {
                if (hasDay) {
                    if (['назад', 'раньше'].includes(PREFIX)) {
                        return calculatePastDate(parseInt(daysMatch[0]));
                    } else {
                        return calculateFutureDate(parseInt(daysMatch[0]));
                    }
                } else {
                    if (['через', 'позже', 'вперед'].includes(PREFIX)) {
                        return '+2';
                    } else if (['назад', 'раньше'].includes(PREFIX)) {
                        return '-2';
                    } else if (['следующий', 'последующий'].includes(PREFIX)) {
                        return 'right now';
                    } else {
                        return DATE[0];
                    }
                }
            }
        } else {
            return taskDate;
        }
    };


      
    realm.write(() => {
        // Изменяем свойства объектов, как вам необходимо
        tasksToUpdate.forEach(task => {
                task.date = DATE.length > 1 ? DATE[1] : DATE[0]; // замените на новое значение
                task.time = (TIME.length > 1 && TIME[1] || TIME.length == 1 && TIME[0])
                task.name = (TASK.length > 1 && TASK[1] || TASK.length == 1 && task.name)
                task.person = (PER.length > 1 && PER[1] || PER.length == 1 && PER[0])
                // замените на новое значение
                // ... другие изменения
        });
    });

    return 'задание обновлено'
}

export function whoCreated(newTask) {
    const foundedTasks = getTasks(newTask)
    const answer = foundedTasks.map(i=> {return {created: i.createdAt, updated: i.updatedAt, creator: 'вы'}})
    return answer
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
