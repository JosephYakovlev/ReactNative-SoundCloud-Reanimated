import { parseISO,addHours, setHours, addMinutes, setMinutes, addDays } from 'date-fns';




const TimeArrayOne = ['завтра', 'послезавтра', 'понедельник', 'вторник', 'среда', 
                      'четверг', 'пятница', 'суббота', 'воскресенье',  'январь', 'февраль', 
                      'март', 'апрель', 'май', 'июнь','июль', 'август', 'сентябрь', 'октябрь', 
                      'ноябрь', 'декабрь','следующий' ]
                



export const newTimeFutureParser = (TIME: string | null, DATE:string, LEMMDATE:string, PREFIX:string, hasHour: boolean, hasMinute: boolean): string => {


    const match = (i: string) => i.match(/\d+/);
    const firstNumber = (match: RegExpMatchArray | null) => (match ? parseInt(match[0]) : 0)
    const timeMatch = (i: string): RegExpMatchArray | null => i.match(/(\d{1,2})\s*:\s*(\d{2})/);

    console.log('TIME in TIMEF');
    console.log(TIME);
    console.log('DATE in TIMEF');
    console.log(DATE);
    console.log(typeof DATE);
    console.log('LEMMDATE in TIMEF');
    console.log(LEMMDATE);
    console.log(typeof LEMMDATE);
    console.log('PREFIX in TIMEF');
    console.log(PREFIX);
    console.log('hasHour in TIMEF');
    console.log(hasHour);  
    console.log('hasMinute in TIMEF');
    console.log(hasMinute);    

    console.log('STARTING TIME PARSER FUTURE');
    const current_date: Date = new Date()
    current_date.setHours(current_date.getHours()+ 3)
    console.log(current_date);

    function isIsoFormat(s: string): boolean {
        const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z)?$/;
        return pattern.test(s);
    }
    

    let bool = TimeArrayOne.some(word => LEMMDATE.includes(word))
    console.log(bool);
         

    if (TIME) {

        
        console.log(current_date);
        
        const dateString: string = isIsoFormat(DATE) ? DATE : current_date.toISOString();
        const parsedDate = parseISO(dateString);
        parsedDate.setHours(parsedDate.getHours())
        console.log(parsedDate);   
        console.log(parsedDate);
        console.log(1);
        const matchedNumber = firstNumber(match(TIME))
        console.log(matchedNumber);
        
            if (hasMinute) { // 20 минут
                if (['через', 'позже', 'вперед','следующий'].some(word => PREFIX.includes(word)) && bool) {
                    console.log('TimeParser есть минуты и есть префикс вперед');
                    const futureTime = addMinutes(parsedDate,matchedNumber)
                    console.log('TimeParser есть минуты и есть префикс вперед вывод:');
                    console.log(futureTime);
                    console.log(typeof futureTime);
                    return futureTime.toISOString()
                } else {
                    console.log('TimeParser есть минуты но нет префикса вперед');
                    const futureTime = setMinutes(parsedDate, matchedNumber) 
                    // Добавляем часы и минуты к дате
                    console.log('Минуты установлены');
                    console.log('TimeParser есть часы но нет префикса вперед вывод:');
                    console.log(futureTime);
                    console.log(typeof futureTime);
                    return futureTime.toISOString()
                } 
            } else if (hasHour) { // 20 часов
                if (['через', 'позже', 'вперед','следующий'].some(word => PREFIX.includes(word)) && bool) {
                    console.log('TimeParser есть часы и есть префикс вперед');
                    console.log(matchedNumber);
                    console.log(current_date);
                    
                    
                    const futureTime = setHours(parsedDate,current_date.getHours() + matchedNumber)
                    console.log('TimeParser есть часы и есть префикс вперед вывод:');
                    console.log(futureTime);
                    console.log(typeof futureTime);
                    return futureTime.toISOString()
                } else {
                    console.log('TimeParser есть часы но нет префикса');
                    const futureTime = setHours(parsedDate,matchedNumber)
                    console.log('Часы установлены');
                    console.log('TimeParser есть часы но нет префикса вывод:');
                    console.log(futureTime);
                    console.log(typeof futureTime);
                    return futureTime.toISOString()
                } 
            } else {
                
                if (['через', 'позже', 'вперед'].some(word => PREFIX.includes(word)) && bool) {
                    console.log('Завтра через 17 : 00');
                    console.log('TimeParser нет часов нет минут но есть префикс вперед.');

                    const timeMatchResult = timeMatch(TIME);

                    const desiredMinutes = timeMatchResult ? timeMatchResult[2] : '1';
                    const desiredHours = timeMatchResult ? timeMatchResult[1] : '0';
                    // // Добавляем часы и минуты к дате
                    // const minutesToAdd = currentDate.getMinutes() + desiredMinutes 
                    // const hoursToAdd = currentDate.getHours() + desiredHours;
                    const futureMinutes = addMinutes(parsedDate,parseInt(desiredMinutes))
                    const futureTime = addHours(futureMinutes,parseInt(desiredHours))
                      console.log('TimeParser нет часов нет минут но есть префикс вывод:');
                      console.log(futureTime);
                      console.log(typeof futureTime);      
                      return futureTime.toISOString()   

                    // return initialDate
                    
                } else {
                    console.log('TimeParser нет часов нет минут нет префикса');
                    console.log('Завтра 17 : 00');
                    const currentDate = parseISO(DATE);
                    currentDate.setHours(currentDate.getHours())  // Сначала создайте объект currentDate
                    console.log(DATE);
                    
                    console.log('14134342347774');
                    console.log(currentDate);
                    console.log(TIME);
                    
                    
                    
                    const timeMatchResult = timeMatch(TIME);
                    console.log(timeMatchResult);
                    const desiredMinutes = timeMatchResult ? timeMatchResult[2] : '1';
                    const desiredHours = timeMatchResult ? timeMatchResult[1] : '0';
                    console.log(desiredMinutes);
                    console.log(desiredHours);
                    console.log(currentDate);
                    
                    const futureTime = new Date(Date.UTC(
                        parseInt(DATE.substring(0,4)),
                        parseInt(DATE.substring(5,7)),
                        parseInt(DATE.substring(8,10)),
                        parseInt(desiredHours),
                        parseInt(desiredMinutes),
                        currentDate.getSeconds()
                      ));
                    const newFutureTime = `${DATE.substring(0,4)}-${DATE.substring(5,7)}-${DATE.substring(8,10)}T${desiredHours}:${desiredMinutes}:00.000Z`
                    futureTime.setHours
                    console.log('TimeParser нет часов нет минут нет префикса только вперед вывод:');
                    console.log(parseInt(DATE.substring(5,7)));
                    
                    console.log(newFutureTime);
                    
                    console.log(futureTime.toISOString);
                    console.log(typeof newFutureTime);

                    return newFutureTime
                }
            }
    } else {
        console.log('TimeParser !TIME');
        
        const dateString: string = isIsoFormat(DATE) ? DATE : current_date.toISOString();
        const parsedDate = parseISO(dateString);
        parsedDate.setHours(parsedDate.getHours() + 3)
        const futureDay = addDays(parsedDate, 1)
        const futureMinutes = setMinutes(futureDay, 0)
        const futureTime = setHours(futureMinutes, 10)
        console.log('TimeParser   !TIME вывод:');    
        console.log(futureTime);
        console.log(typeof futureTime);
            
        return futureTime.toISOString()
    }  
};


export const newTimeFuturePastParser = (TIME: string | null, DATE:string, LEMMDATE:string, PREFIX:string, hasHour: boolean, hasMinute: boolean): string => {


    const match = (i: string) => i.match(/\d+/);
    const firstNumber = (match: RegExpMatchArray | null) => (match ? parseInt(match[0]) : 0)
    const timeMatch = (i: string): RegExpMatchArray | null => i.match(/(\d{1,2})\s*:\s*(\d{2})/);

    console.log('TIME in TIME');
    console.log(TIME);
    console.log('DATE in TIME');
    console.log(DATE);
    console.log(typeof DATE);
    console.log('LEMMDATE in TIME');
    console.log(LEMMDATE);
    console.log(typeof LEMMDATE);
    console.log('PREFIX in TIME');
    console.log(PREFIX);
    console.log('hasHour in TIME');
    console.log(hasHour);  
    console.log('hasMinute in TIME');
    console.log(hasMinute);    

    console.log('STARTING TIME PARSER FUTURE PAST');
    const current_date: Date = new Date()
    current_date.setHours(current_date.getHours() + 3)
    console.log(current_date);

    function isIsoFormat(s: string): boolean {
        const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z)?$/;
        return pattern.test(s);
    }
    

    let bool = TimeArrayOne.some(word => LEMMDATE.includes(word))
    console.log(bool);
         

    if (TIME) {

        
        const dateString: string = isIsoFormat(DATE) ? DATE : current_date.toISOString();
        const parsedDate = parseISO(dateString);
        parsedDate.setHours(parsedDate.getHours() + 3)
        console.log(parsedDate);
        
        console.log(parsedDate);
        console.log(1);
        const matchedNumber = firstNumber(match(TIME))
        console.log(matchedNumber);
        
        
            if (hasMinute) { // 20 минут
                if (['через', 'позже', 'вперед','следующий'].some(word => PREFIX.includes(word)) && bool) {
                    console.log('TimeParser есть минуты и есть префикс вперед');
                    const futureTime = addMinutes(parsedDate,matchedNumber)
                    console.log('TimeParser есть минуты и есть префикс вперед вывод:');
                    console.log(futureTime);
                    console.log(typeof futureTime);
                    return futureTime.toISOString()
                } else if (['раньше', 'назад',].some(word => PREFIX.includes(word)) && bool) {
                    console.log('TimeParser есть минуты и есть префикс назад');
                    const futureTime = addMinutes(parsedDate,-matchedNumber)
                    console.log('TimeParser есть минуты и есть префикс назад вывод:');
                    console.log(futureTime);
                    console.log(typeof futureTime);
                    return futureTime.toISOString()
                } else {
                    console.log('TimeParser есть минуты но нет префикса вперед');
                    const futureTime = setMinutes(parsedDate, matchedNumber) 
                    // Добавляем часы и минуты к дате
                    console.log('Минуты установлены');
                    console.log('TimeParser есть часы но нет префикса вперед вывод:');
                    console.log(futureTime);
                    console.log(typeof futureTime);
                    return futureTime.toISOString()
                } 
            } else if (hasHour) { // 20 часов
                if (['через', 'позже', 'вперед','следующий'].some(word => PREFIX.includes(word)) && bool) {
                    console.log('TimeParserPAST есть часы и есть префикс вперед');
                    console.log(matchedNumber);

                    const futureTime = setHours(parsedDate,current_date.getHours() + matchedNumber)
                    console.log('TimeParserPAST есть часы и есть префикс вперед вывод:');
                    console.log(futureTime);
                    console.log(typeof futureTime);
                    return futureTime.toISOString()
                } else if (['раньше', 'назад'].some(word => PREFIX.includes(word)) && bool) {
                    console.log('TimeParser есть часы и есть префикс назад');
                    const futureTime = setHours(parsedDate,current_date.getHours() - matchedNumber)
                    console.log('TimeParserPAST есть часы и есть префикс назад вывод:');
                    console.log(futureTime);
                    console.log(typeof futureTime);
                    return futureTime.toISOString()
                } else {
                    console.log('TimeParser есть часы но нет префикса');

                    console.log(matchedNumber);
                    console.log(typeof matchedNumber);
                    
                    const futureTime = setHours(parsedDate,matchedNumber+3)
                    futureTime.setMinutes(0, 0, 0);
                    console.log('Часы установлены');
                    console.log('TimeParser есть часы но нет префикса вывод:');
                    console.log(futureTime);
                    console.log(typeof futureTime);
                    return futureTime.toISOString()
                } 
            } else {
                
                if (['через', 'позже', 'вперед'].some(word => PREFIX.includes(word)) && bool) {
                    console.log('Завтра через 17 : 00 PAST');
                    console.log('TimeParser нет часов нет минут но есть префикс вперед.');
                    console.log(TIME);
                    console.log(timeMatch(TIME));
                    
                    
                    const timeMatchResult = timeMatch(TIME);
                    console.log(timeMatchResult);
                    const desiredMinutes = timeMatchResult ? timeMatchResult[2] : '1';
                    const desiredHours = timeMatchResult ? timeMatchResult[1] : '0';
                    // // Добавляем часы и минуты к дате
                    // const minutesToAdd = currentDate.getMinutes() + desiredMinutes 
                    // const hoursToAdd = currentDate.getHours() + desiredHours;
                    const futureMinutes = addMinutes(parsedDate,parseInt(desiredMinutes))
                    const futureTime = addHours(futureMinutes,parseInt(desiredHours))
                      console.log('TimeParser нет часов нет минут но есть префикс вывод:');
                      console.log(futureTime);
                      console.log(typeof futureTime);      
                      return futureTime.toISOString()   

                    // return initialDate
                    
                } else  if (['ранний', 'назад'].some(word => PREFIX.includes(word)) && bool) {
                    console.log('Завтра назад 17 : 00');
                    console.log('TimeParser нет часов нет минут но есть префикс назад.');
                    console.log(TIME);
                    console.log(timeMatch(TIME));
                    
                    
                    const timeMatchResult = timeMatch(TIME);
                    console.log(timeMatchResult);

                    const desiredMinutes = timeMatchResult ? timeMatchResult[2] : '0';
                    const desiredHours = timeMatchResult ? timeMatchResult[1].length < 2 ? '0'+timeMatchResult[1] : timeMatchResult[1] : '0';
                    // // Добавляем часы и минуты к дате
                    // const minutesToAdd = currentDate.getMinutes() + desiredMinutes 
                    // const hoursToAdd = currentDate.getHours() + desiredHours;
                    console.log(parsedDate);
                    
                    const futureMinutes = addMinutes(parsedDate,-parseInt(desiredMinutes))
                    console.log(futureMinutes);
                    
                    const futureTime = addHours(futureMinutes,-parseInt(desiredHours))
                      console.log('TimeParser нет часов нет минут но есть префикс назад вывод:');
                      console.log(futureTime);
                      console.log(typeof futureTime);      
                      return futureTime.toISOString()   

                    // return initialDate
                    
                } else {
                    console.log('TimeParser нет часов нет минут нет префикса');
                    console.log('Завтра 17 : 00');
                    const currentDate = new Date();
                    current_date.setHours(current_date.getHours() + 3)  // Сначала создайте объект currentDate
                    console.log('14134342347772');
                    console.log(currentDate);
                    
                    
                    const timeMatchResult = timeMatch(TIME);
                    console.log(timeMatchResult);
                    const desiredMinutes = timeMatchResult ? timeMatchResult[2] : '1';
                    const desiredHours = timeMatchResult ? timeMatchResult[1] : '0';
                    console.log(desiredMinutes);
                    console.log(desiredHours);

                    const futureTime = new Date(Date.UTC(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate(),
                        parseInt(desiredHours),
                        parseInt(desiredMinutes),
                        currentDate.getSeconds()
                      ));
    
                    console.log('TimeParser нет часов нет минут нет префикса вывод:');
                    console.log(futureTime);
                    console.log(typeof futureTime);

                    return futureTime.toISOString()
                }
            }
    } else {
        console.log('TimeParser !TIME');
        
        const dateString: string = isIsoFormat(DATE) ? DATE : current_date.toISOString();
        const parsedDate = parseISO(dateString);
        parsedDate.setHours(parsedDate.getHours() + 3)
        const futureDay = addDays(parsedDate, 1)
        const futureMinutes = setMinutes(futureDay, 0)
        const futureTime = setHours(futureMinutes, 10)
        console.log('TimeParser   !TIME вывод:');    
        console.log(futureTime);
        console.log(typeof futureTime);
            
        return futureTime.toISOString()
    }  
};
