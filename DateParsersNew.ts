import { parseISO, addDays, addWeeks, addMonths, addYears, addHours } from 'date-fns';


export const newDateFutureParser = (DATE: string ,PREFIX: string, hasDay: boolean, hasWeek: boolean, hasMonth: boolean, hasYear: boolean, ): string => {
        console.log(13);


        function isIsoFormat(s: string): boolean {
            const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z)?$/;
            return pattern.test(s);
        }

        
        const match = (i: string) => i.match(/\d+/);
        const firstNumber = (match: RegExpMatchArray | null) => (match ? parseInt(match[0]) : 0)

        if (DATE) {
            const current_date: Date = new Date()
            current_date.setHours(current_date.getHours() + 3)
            console.log(isIsoFormat(DATE));

            const dateString: string = isIsoFormat(DATE) ? DATE : current_date.toISOString();
            console.log(dateString);
            const parsedDate: Date = parseISO(dateString);
            parsedDate.setHours(parsedDate.getHours() + 3)

            console.log(2222);
            console.log(parsedDate);
            const parsedDate1 = parsedDate;
            console.log(parsedDate1);

            if(dateString === current_date.toISOString()) {
                console.log(117)
                parsedDate.setHours(parsedDate.getHours() + 3);
            }

            if(dateString === current_date.toISOString()) {
                console.log(118)
                const newTime = addHours(parsedDate1,parsedDate.getHours() + 3)
                console.log(newTime);
                
            }

            console.log(parsedDate1);
            
            console.log(parsedDate);
            console.log('FUTURETIME1 ' + parsedDate );
            
            

            if (hasDay) { // 2 дня
                if (['через', 'позже', 'вперед','следующий'].some(word => PREFIX[0].includes(word))) {
                    console.log('DateParser есть дни и есть префикс вперед ');
                    console.log(DATE);
                    console.log(firstNumber(match(DATE))); 
                    const additionalDays = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                    parsedDate.setDate(parsedDate.getDate() + additionalDays);
                    console.log('DateParser есть дни и есть префикс вперед вывод:');
                    console.log(parsedDate);
                    console.log(typeof parsedDate);
                } else {
                    console.log('DateParser есть дни и нет префикс вперед ');
                    const additionalDays = firstNumber(match(DATE));
                    parsedDate.setDate(parsedDate.getDate() + additionalDays);
                    console.log('DateParser есть дни и нет префикс вперед вывод:');
                    console.log(parsedDate);
                    console.log(typeof parsedDate);
                } 
            } 
            if (hasWeek) { // 2 недели
                if (['через', 'позже', 'вперед','следующий'].some(word => PREFIX[0].includes(word))) {
                    console.log('DateParser есть недели и есть префикс вперед ');
                    const additionalWeeks = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                    const days = additionalWeeks*7 
                    parsedDate.setDate(parsedDate.getDate() + days);
                    console.log('DateParser есть недели и есть префикс вперед вывод:');
                    console.log(parsedDate);
                    console.log(typeof parsedDate);
                } else {
                    console.log('DateParser есть недели и нет префикс вперед ');
                    const additionalWeeks = firstNumber(match(DATE));
                    const days = additionalWeeks*7 
                    parsedDate.setDate(parsedDate.getDate() + days);
                    console.log('DateParser есть недели и нет префикс вперед вывод:');
                    console.log(parsedDate);
                    console.log(typeof parsedDate);
                } 
            }
            if (hasMonth) { // 2 месяца
                if (['через', 'позже', 'вперед','следующий'].some(word => PREFIX[0].includes(word))) {
                    console.log('DateParser есть месяцы и есть префикс вперед ');
                    const additionalMonthes = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                    parsedDate.setMonth(parsedDate.getMonth() + additionalMonthes);
                    console.log('DateParser есть месяцы и есть префикс вперед вывод:');
                    console.log(parsedDate);
                    console.log(typeof parsedDate);
                } else {
                    console.log('DateParser есть месяцы и нет префикс вперед ');
                    const additionalMonthes = firstNumber(match(DATE));
                    parsedDate.setMonth(parsedDate.getMonth() + additionalMonthes);
                    console.log('DateParser есть месяцы и нет префикс вперед вывод:');
                    console.log(parsedDate);
                    console.log(typeof parsedDate);
                } 
            } 
            if (hasYear) { // 2 года
                if (['через', 'позже', 'вперед','следующий'].some(word => PREFIX[0].includes(word))) {
                    console.log('DateParser есть годы и есть префикс вперед ');
                    const additionalYears = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                    parsedDate.setFullYear(parsedDate.getFullYear() + additionalYears);
                    console.log('DateParser есть годы и есть префикс вперед вывод:');
                    console.log(parsedDate);
                    console.log(typeof parsedDate);
                } else {
                    console.log('DateParser есть годы и нет префикс вперед ');
                    const additionalYears = firstNumber(match(DATE));
                    parsedDate.setFullYear(parsedDate.getFullYear() + additionalYears);
                    console.log('DateParser есть годы и нет префикс вперед вывод:');
                    console.log(parsedDate);
                    console.log(typeof parsedDate);
                } 
            }
            console.log(parsedDate);
            console.log('FUTURETIME1 ' + parsedDate );
            console.log(parsedDate);
            console.log('FUTURETIME1 ' + parsedDate.toISOString() );
            


            return parsedDate.toISOString()
        } else {

            console.log('DateParser !DATE');
            const current_date: Date = new Date()
            current_date.setHours(current_date.getHours() + 3)
            const dateString: string = isIsoFormat(DATE) ? DATE : current_date.toISOString();
            const parsedDate = parseISO(dateString);
            parsedDate.setHours(parsedDate.getHours() + 3)
            const futureTime = addDays(parsedDate, 1)
            console.log('DateParser !TIME вывод:');    
            console.log(futureTime);
            console.log(typeof futureTime);
                
            return futureTime.toISOString()
        }
};

export const newDateFuturePastParser = (DATE: string ,PREFIX: string, hasDay: boolean, hasWeek: boolean, hasMonth: boolean, hasYear: boolean, ): string => {
    console.log(13);
    console.log(DATE);
    


    function isIsoFormat(s: string): boolean {
        const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z)?$/;
        return pattern.test(s);
    }

    
    const match = (i: string) => i.match(/\d+/);
    const firstNumber = (match: RegExpMatchArray | null) => (match ? parseInt(match[0]) : 0)

    if (DATE) {
        const current_date: Date = new Date()
        current_date.setHours(current_date.getHours() + 3)


        const dateString: string = isIsoFormat(DATE) ? DATE : current_date.toISOString();

        const parsedDate = parseISO(dateString);
        const parsedDate1 = parseISO(dateString);
        parsedDate.setHours(parsedDate.getHours() + 3)
        parsedDate1.setHours(parsedDate.getHours() + 3)


        console.log(parsedDate1);
        
        console.log(parsedDate);
        console.log('FUTURETIME1 ' + parsedDate );
        
        

        if (hasDay) { // 2 дня
            if (['через', 'позже', 'вперед','следующий'].some(word => PREFIX[0].includes(word))) {
                console.log('DateParser есть дни и есть префикс вперед ');
                console.log(DATE);
                console.log(firstNumber(match(DATE))); 
                const additionalDays = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                parsedDate.setDate(parsedDate.getDate() + additionalDays);
                console.log('DateParser есть дни и есть префикс вперед вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            }  else if (['раньше', 'назад'].some(word => PREFIX[0].includes(word))) {
                console.log('DateParser есть дни и есть префикс назад ');
                const additionalDays = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                parsedDate.setDate(parsedDate.getDate() - additionalDays);
                console.log('DateParser есть дни и есть префикс назад вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } else {
                console.log('DateParser есть дни и нет префикс вперед ');
                const additionalDays = firstNumber(match(DATE));
                parsedDate.setDate(parsedDate.getDate() + additionalDays);
                console.log('DateParser есть дни и нет префикс вперед вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } 
        } 
        if (hasWeek) { // 2 недели
            if (['через', 'позже', 'вперед','следующий'].some(word => PREFIX[0].includes(word))) {
                console.log('DateParser есть недели и есть префикс вперед ');
                const additionalWeeks = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                const days = additionalWeeks*7 
                parsedDate.setDate(parsedDate.getDate() + days);
                console.log('DateParser есть недели и есть префикс вперед вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            }  else if (['раньше', 'назад'].some(word => PREFIX[0].includes(word))) {
                console.log('DateParser есть недели и есть префикс назад ');
                const additionalWeeks = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                const days = additionalWeeks*7 
                parsedDate.setDate(parsedDate.getDate() - days);
                console.log('DateParser есть недели и есть префикс назад вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } else {
                console.log('DateParser есть недели и нет префикс вперед ');
                const additionalWeeks = firstNumber(match(DATE));
                const days = additionalWeeks*7 
                parsedDate.setDate(parsedDate.getDate() + days);
                console.log('DateParser есть недели и нет префикс вперед вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } 
        }
        if (hasMonth) { // 2 месяца
            if (['через', 'позже', 'вперед','следующий'].some(word => PREFIX[0].includes(word))) {
                console.log('DateParser есть месяцы и есть префикс вперед ');
                const additionalMonthes = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                parsedDate.setMonth(parsedDate.getMonth() + additionalMonthes);
                console.log('DateParser есть месяцы и есть префикс вперед вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } else if (['раньше', 'назад'].some(word => PREFIX[0].includes(word))) {
                console.log('DateParser есть месяцы и есть префикс назад ');
                const additionalMonthes = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                parsedDate.setMonth(parsedDate.getMonth() - additionalMonthes);
                console.log('DateParser есть месяцы и есть префикс назад вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } else {
                console.log('DateParser есть месяцы и нет префикс вперед ');
                const additionalMonthes = firstNumber(match(DATE));
                parsedDate.setMonth(parsedDate.getMonth() + additionalMonthes);
                console.log('DateParser есть месяцы и нет префикс вперед вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } 
        } 
        if (hasYear) { // 2 года
            if (['через', 'позже', 'вперед','следующий'].some(word => PREFIX[0].includes(word))) {
                console.log('DateParser есть годы и есть префикс вперед ');
                const additionalYears = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                parsedDate.setFullYear(parsedDate.getFullYear() + additionalYears);
                console.log('DateParser есть годы и есть префикс вперед вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } else if (['раньше', 'назад'].some(word => PREFIX[0].includes(word))) {
                console.log('DateParser есть годы и есть префикс назад ');
                const additionalYears = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                parsedDate.setFullYear(parsedDate.getFullYear() - additionalYears);
                console.log('DateParser есть годы и есть префикс назад вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } else {
                console.log('DateParser есть годы и нет префикс вперед ');
                const additionalYears = firstNumber(match(DATE));
                parsedDate.setFullYear(parsedDate.getFullYear() + additionalYears);
                console.log('DateParser есть годы и нет префикс вперед вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } 
        }

        console.log(parsedDate);
        console.log('FUTURETIME1 ' + parsedDate.toISOString() );
        
        return parsedDate.toISOString()
    } else {

        console.log('DateParser !DATE');
        const current_date: Date = new Date()
        current_date.setHours(current_date.getHours() + 3)
        const dateString: string = isIsoFormat(DATE) ? DATE : current_date.toISOString();
        const parsedDate = parseISO(dateString);
        parsedDate.setHours(parsedDate.getHours() + 3)
        const futureTime = addDays(parsedDate, 1)
        console.log('DateParser !TIME вывод:');    
        console.log(futureTime);
        console.log(typeof futureTime);
            
        return futureTime.toISOString()
    }
};

export const newDateFuturePastSearchParser = (DATE: string ,PREFIX: string, hasDay: boolean, hasWeek: boolean, hasMonth: boolean, hasYear: boolean, ): string => {
    console.log(13);


    function isIsoFormat(s: string): boolean {
        const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z)?$/;
        return pattern.test(s);
    }

    
    const match = (i: string) => i.match(/\d+/);
    const firstNumber = (match: RegExpMatchArray | null) => (match ? parseInt(match[0]) : 0)

    if (DATE) {
        const current_date: Date = new Date()
        current_date.setHours(current_date.getHours() + 3)

        const dateString: string = isIsoFormat(DATE) ? DATE : current_date.toISOString();

        const parsedDate = parseISO(dateString);
        const parsedDate1 = parseISO(dateString);

        parsedDate.setHours(parsedDate.getHours() + 3)
        parsedDate1.setHours(parsedDate.getHours() + 3)

        console.log(parsedDate1);
        
        console.log(parsedDate);
        console.log('FUTURETIME1 ' + parsedDate );
        
        

        if (hasDay) { // 2 дня
            if (['через', 'позже', 'вперед','следующий'].some(word => PREFIX[0].includes(word))) {
                console.log('DateParser есть дни и есть префикс вперед ');
                console.log(DATE);
                console.log(firstNumber(match(DATE))); 
                const additionalDays = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                parsedDate.setDate(parsedDate.getDate() + additionalDays);
                console.log('DateParser есть дни и есть префикс вперед вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            }  else if (['раньше', 'назад'].some(word => PREFIX[0].includes(word))) {
                console.log('DateParser есть дни и есть префикс назад ');
                const additionalDays = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                parsedDate.setDate(parsedDate.getDate() - additionalDays);
                console.log('DateParser есть дни и есть префикс назад вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } else {
                console.log('DateParser есть дни и нет префикс вперед ');
                const additionalDays = firstNumber(match(DATE));
                parsedDate.setDate(parsedDate.getDate() + additionalDays);
                console.log('DateParser есть дни и нет префикс вперед вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } 
        } 
        if (hasWeek) { // 2 недели
            if (['через', 'позже', 'вперед','следующий'].some(word => PREFIX[0].includes(word))) {
                console.log('DateParser есть недели и есть префикс вперед ');
                const additionalWeeks = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                const days = additionalWeeks*7 
                parsedDate.setDate(parsedDate.getDate() + days);
                console.log('DateParser есть недели и есть префикс вперед вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            }  else if (['раньше', 'назад'].some(word => PREFIX[0].includes(word))) {
                console.log('DateParser есть недели и есть префикс назад ');
                const additionalWeeks = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                const days = additionalWeeks*7 
                parsedDate.setDate(parsedDate.getDate() - days);
                console.log('DateParser есть недели и есть префикс назад вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } else {
                console.log('DateParser есть недели и нет префикс вперед ');
                const additionalWeeks = firstNumber(match(DATE));
                const days = additionalWeeks*7 
                parsedDate.setDate(parsedDate.getDate() + days);
                console.log('DateParser есть недели и нет префикс вперед вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } 
        }
        if (hasMonth) { // 2 месяца
            if (['через', 'позже', 'вперед','следующий'].some(word => PREFIX[0].includes(word))) {
                console.log('DateParser есть месяцы и есть префикс вперед ');
                const additionalMonthes = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                parsedDate.setMonth(parsedDate.getMonth() + additionalMonthes);
                console.log('DateParser есть месяцы и есть префикс вперед вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } else if (['раньше', 'назад'].some(word => PREFIX[0].includes(word))) {
                console.log('DateParser есть месяцы и есть префикс назад ');
                const additionalMonthes = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                parsedDate.setMonth(parsedDate.getMonth() - additionalMonthes);
                console.log('DateParser есть месяцы и есть префикс назад вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } else {
                console.log('DateParser есть месяцы и нет префикс вперед ');
                const additionalMonthes = firstNumber(match(DATE));
                parsedDate.setMonth(parsedDate.getMonth() + additionalMonthes);
                console.log('DateParser есть месяцы и нет префикс вперед вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } 
        } 
        if (hasYear) { // 2 года
            if (['через', 'позже', 'вперед','следующий'].some(word => PREFIX[0].includes(word))) {
                console.log('DateParser есть годы и есть префикс вперед ');
                const additionalYears = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                parsedDate.setFullYear(parsedDate.getFullYear() + additionalYears);
                console.log('DateParser есть годы и есть префикс вперед вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } else if (['раньше', 'назад'].some(word => PREFIX[0].includes(word))) {
                console.log('DateParser есть годы и есть префикс назад ');
                const additionalYears = firstNumber(match(DATE)) >= 1 ? firstNumber(match(DATE))  : firstNumber(match(DATE)) + 1
                parsedDate.setFullYear(parsedDate.getFullYear() - additionalYears);
                console.log('DateParser есть годы и есть префикс назад вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } else {
                console.log('DateParser есть годы и нет префикс вперед ');
                const additionalYears = firstNumber(match(DATE));
                parsedDate.setFullYear(parsedDate.getFullYear() + additionalYears);
                console.log('DateParser есть годы и нет префикс вперед вывод:');
                console.log(parsedDate);
                console.log(typeof parsedDate);
            } 
        }

        console.log(parsedDate);
        console.log('FUTURETIME1 ' + parsedDate.toISOString() );
        
        return parsedDate.toISOString()
    } else {

        console.log('DateParser !DATE');
        const current_date: Date = new Date()
        current_date.setHours(current_date.getHours() + 3)
        const dateString: string = isIsoFormat(DATE) ? DATE : current_date.toISOString();
        const parsedDate = parseISO(dateString);
        parsedDate.setHours(parsedDate.getHours() + 3)
        const futureTime = addDays(parsedDate, 1)
        console.log('DateParser !TIME вывод:');    
        console.log(futureTime);
        console.log(typeof futureTime);
            
        return futureTime.toISOString()
    }
};
