//Check when moving next
async function getDataNext(i, j) {
    const response = await fetch('/api');
    const all = await response.json();

    if (all.length != 0) {
        try {
            (all[i].a == 1) ? document.getElementById(`answer-${i+j}`).checked = true : document.getElementById(`answer-${i+j}`).checked = false;
            (all[i].b == 1) ? document.getElementById(`answer-${i+j+1}`).checked = true : document.getElementById(`answer-${i+j+1}`).checked = false;
            (all[i].c == 1) ? document.getElementById(`answer-${i+j+2}`).checked = true : document.getElementById(`answer-${i+j+2}`).checked = false;
        } catch(err) {
            // console.log(err)
        }
    }
};

//Check when moving back
async function getDataBack(i, j) {
    const response = await fetch('/api');
    const all = await response.json();

    if (all.length != 0) {
        try {
            (all[i-2].a == 1) ? document.getElementById(`answer-${i+j-6}`).checked = true : document.getElementById(`answer-${i+j-6}`).checked = false;
            (all[i-2].b == 1) ? document.getElementById(`answer-${i+j-5}`).checked = true : document.getElementById(`answer-${i+j-5}`).checked = false;
            (all[i-2].c == 1) ? document.getElementById(`answer-${i+j-4}`).checked = true : document.getElementById(`answer-${i+j-4}`).checked = false;
        } catch(err) {
            // console.log(err)
        }
    }
};

//Fix appearance after refreshing 
document.body.onload = async function() {
    const questions = [];
    const answers = [];

    const realAnswers = [];

    const response = await fetch('questions.csv');
    const data = await response.text();

    const right = await fetch('answers.csv');
    const dataRight = await right.text();
    
    const table = data.split("\n").slice(1);
    const rightAnswers = dataRight.split("\n");
    
    table.forEach(row => {
        const columns = row.split(';');
        
        const question = columns[0];
        
        questions.push(question);

        const answerA = columns[1];
        const answerB = columns[2];
        const answerC = columns[3];

        answers.push(answerA, answerB, answerC);
    });

    let i = Number(localStorage.getItem('i')),
        j = Number(localStorage.getItem('j'));

    if (i >= 1 && i <= questions.length) {
        document.getElementById('btn-next').style = 'display:true;';
        document.getElementById('btn-back').style = 'display:true;';
        document.getElementById('btn-start').style = 'display:none;';
        document.getElementById('Submit').innerHTML = 
            `<div id="sss">
                <p><b>Задание ${i}</b></p>
                <div>
                    <div class="question-wrapper">${questions[i-1]}</div>
                    <br>
                    <input id="answer-${i+j-3}" type="radio" name="first"><label for="answer-${i+j-3}">${answers[i+j-3]}</label><em></em>
                
                    <br>
                    <input id="answer-${i+j+1-3}" type="radio" name="first"><label for="answer-${i+j+1-3}">${answers[i+j+1-3]}</label> 
                    
                    <br>
                    <input id="answer-${i+j+2-3}" type="radio" name="first"><label for="answer-${i+j+2-3}">${answers[i+j+2-3]}</label>
                
                </div>
            </div>
            `;
    } else if(i>questions.length) {

    }
};

//Next Button ...(big shit, heh)
async function next() {
    const questions = []; //3
    const answers = []; //9
    const realAnswers = [];

    const response = await fetch('questions.csv');
    const data = await response.text();

    const right = await fetch('answers.csv');
    const dataRight = await right.text();
    
    const table = data.split("\n").slice(1);
    const rightAnswers = dataRight.split("\n");
    
    table.forEach(row => {
        const columns = row.split(';');
        
        const question = columns[0];
        
        questions.push(question);

        const answerA = columns[1];
        const answerB = columns[2];
        const answerC = columns[3];

        answers.push(answerA, answerB, answerC);
    })

    if(typeof(Storage) !== "undefined") {
        if (localStorage) {
            
            let i = Number(localStorage.getItem('i')),
                j = Number(localStorage.getItem('j'));
                
            const limit = questions.length;
            const limitAnswer = answers.length;

                try {if (i>0) {
                        const options = {
                            method:'POST',
                            headers: {
                                'Content-Type':'application/json'
                            },
                            body: JSON.stringify({
                                a:`${document.getElementById(`answer-${i+j-3}`).checked ? 1 : 0}`,
                                b:`${document.getElementById(`answer-${i+j-2}`).checked ? 1 : 0}`,
                                c:`${document.getElementById(`answer-${i+j-1}`).checked ? 1 : 0}`,
                                _id:i
                                })
                        };
                                                
                        await fetch('/api', options); 
                    }
                } catch (error) {
                    console.log(error)
                }

                //Clear Database before the test !!! (Start button)
                if (i == 0 ){
                    const clear = {new: '123'};
                    const options = {
                        method:'POST',
                        headers: {
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify(clear)
                    };
                    
                    await fetch('/api', options);   
                }

                //What is happening after the finish
                if (i >= limit-1) {
                    document.getElementById('btn-next').textContent = "Finish";
                    document.getElementById('Submit').innerHTML = 
                        `<div id="sss">
                            <p><b>Задание ${limit}</b></p>
                            <div>
                                <div class="question-wrapper">${questions[limit-1]}</div>
                                <br>
                                <input id="answer-${limitAnswer-3}" type="radio" name="first"><label for="answer-${limitAnswer-3}">${answers[limitAnswer-3]}</label><em></em>
                            
                                <br>
                                <input id="answer-${limitAnswer-2}" type="radio" name="first"><label for="answer-${limitAnswer-2}">${answers[limitAnswer-2]}</label> 
                                
                                <br>
                                <input id="answer-${limitAnswer-1}" type="radio" name="first"><label for="answer-${limitAnswer-1}">${answers[limitAnswer-1]}</label>
                            
                            </div>
                        </div>
                        `;
                    await getDataNext(i,j);
                    localStorage.setItem('i', limit)
                    localStorage.setItem('j', limitAnswer-limit)
                    
                    //Place for counting!!! 
                    if (i >= limit) {
                        
                        document.getElementById('sss').style = 'display:none;';
                        document.getElementById('btn-next').style = 'display:none;';
                        document.getElementById('btn-back').style = 'display:none;';

                        const response = await fetch('/api');
                        const all = await response.json();
                        
                        for (z = 0; z < limit;z++) {
                            const a = all[z].a;
                            const b = all[z].b;
                            const c = all[z].c;

                            realAnswers.push(Number(a));
                            realAnswers.push(Number(b));
                            realAnswers.push(Number(c));

                        };
                        
                        //Place for a new DOM realAnswers VS rightAnswers
                        const sum = [];
                        for(z=0;z < limitAnswer; z+=1){
                            const forSum = Number(rightAnswers[z]) + Number(realAnswers[z]);
                            if (forSum < 2) {
                                sum.push(0);
                            } else { 
                                sum.push(1);
                            }
                        }
                        
                        for(z=0, i=0; z < limitAnswer, i < limit; z+=3, i++){
                            const count = sum[z] + sum[z+1] + sum[z+2]
                            if(count == 0) {
                                wrapper = document.getElementById('Submit');
                                const button = document.createElement('button');
                                button.setAttribute('id', `${i+1}`);
                                button.setAttribute('onclick', `goToTask(${button.id})`);
                                button.textContent = `Task ${i+1}`;
                                button.style = 'color:red';
                                wrapper.appendChild(button);

                            } else {
                                wrapper = document.getElementById('Submit');
                                const button = document.createElement('button');
                                button.setAttribute('id', `${i+1}`);
                                button.setAttribute('onclick', `goToTask(${button.id})`);
                                button.textContent = `Task ${i+1}`;
                                button.style = 'color:green';
                                wrapper.appendChild(button);
                            }
                        }
                    }


                } else {
                    document.getElementById('btn-next').style = 'display:true;';
                    document.getElementById('btn-back').style = 'display:true;';
                    document.getElementById('btn-start').style = 'display:none;';                        
                    
                    document.getElementById('Submit').innerHTML = 
                        `<div id="sss">
                            <p><b>Задание ${i+1}</b></p>
                            <div>
                                <div class="question-wrapper">${questions[i]}</div>
                                <br>
                                <input id="answer-${i+j}" type="radio" name="first"><label for="answer-${i+j}">${answers[i+j]}</label><em></em>
                            
                                <br>
                                <input id="answer-${i+j+1}" type="radio" name="first"><label for="answer-${i+j+1}">${answers[i+j+1]}</label> 
                                
                                <br>
                                <input id="answer-${i+j+2}" type="radio" name="first"><label for="answer-${i+j+2}">${answers[i+j+2]}</label>
                            
                            </div>
                        </div>
                        `;
                    await getDataNext(i, j);
                    localStorage.setItem('i', i+1)
                    localStorage.setItem('j', j+2)

                    //Maybe it's a place for changing values in DB, but keep also in mind back() button!
                }
        } else {
            console.log('yaa')
        }
    } else {
        alert("Sorry, your browser does not support web storage...");
    }
}

//Back button (reversed next button) why ?
async function back() {
    const questions = [];
    const answers = [];

    const response = await fetch('questions.csv');
    const data = await response.text();
    
    const table = data.split("\n").slice(1);
    table.forEach(row => {
        const columns = row.split(';');

        const question = columns[0];
        questions.push(question);

        const answerA = columns[1];
        const answerB = columns[2];
        const answerC = columns[3];
        answers.push(answerA, answerB, answerC);
    })
    
    if(typeof(Storage) !== "undefined") {
        if (localStorage) {
            let i = Number(localStorage.getItem('i')),
                j = Number(localStorage.getItem('j'));

            if (i <= questions.length){
                document.getElementById('btn-next').textContent = "Next";
            }

            if (i <= 1){
                document.getElementById('Submit').innerHTML = 
                `<div id="sss">
                    <p><b>Задание ${1}</b></p>
                    <div>
                        <div class="question-wrapper">${questions[0]}</div>
                        <br>
                        <input id="answer-${0}" type="radio" name="first"><label for="answer-${0}">${answers[0]}</label><em></em>
                    
                        <br>
                        <input id="answer-${1}" type="radio" name="first"><label for="answer-${1}">${answers[1]}</label> 
                        
                        <br>
                        <input id="answer-${2}" type="radio" name="first"><label for="answer-${2}">${answers[2]}</label>
                    
                    </div>
                </div>
                `;
                localStorage.setItem('i', 1)
                localStorage.setItem('j', 2)
                await getDataBack(i,j);
            } else {
                document.getElementById('Submit').innerHTML = 
                    `<div id="sss">
                        <p><b>Задание ${i-1}</b></p>
                        <div>
                            <div class="question-wrapper">${questions[i-2]}</div>
                            <br>
                            <input id="answer-${i+j-6}" type="radio" name="first"><label for="answer-${i+j-6}">${answers[i+j-6]}</label><em></em>
                        
                            <br>
                            <input id="answer-${i+j-5}" type="radio" name="first"><label for="answer-${i+j-5}">${answers[j+i-5]}</label> 
                            
                            <br>
                            <input id="answer-${i+j-4}" type="radio" name="first"><label for="answer-${i+j-4}">${answers[j+i-4]}</label>
                        
                        </div>
                    </div>
                    `;
                await getDataBack(i,j);
                localStorage.setItem('i', i-1)
                localStorage.setItem('j', j-2)
            }   
        } else {
            console.log('yaa')
        }
    } else {
        alert("Sorry, your browser does not support web storage...");
    }
}

//Showing results of the test
async function goToTask(id) {
    const questions = [];
    const answers = [];

    const response = await fetch('questions.csv');
    const data = await response.text();
    
    const table = data.split("\n").slice(1);
    table.forEach(row => {
        const columns = row.split(';');

        const question = columns[0];
        questions.push(question);

        const answerA = columns[1];
        const answerB = columns[2];
        const answerC = columns[3];
        answers.push(answerA, answerB, answerC);
    });

    const wrapper = document.getElementById('result');
    wrapper.innerHTML = null;
    
    const task = document.createElement('p'); //Задание
    const question = document.createElement('div'); //Вопрос
    //Ответы:
    const answerA = document.createElement('input');
    answerA.setAttribute('type','radio');
    answerA.setAttribute('name', 'first');
    const labelForA = document.createElement('label');
    
    const answerB = document.createElement('input');
    answerB.setAttribute('type','radio');
    answerB.setAttribute('name', 'first');
    const labelForB = document.createElement('label');
    
    const answerC = document.createElement('input');
    answerC.setAttribute('type','radio');
    answerC.setAttribute('name', 'first');
    const labelForC = document.createElement('label');

    //setAttribute
    question.textContent = questions[id-1];

    //answers array separation 
    const answersSeparated = answers.slice(3*(id -1), answers.length*id/3);
    //separated FINALLY
    
    answerA.setAttribute('id',`answer-${3*(id -1)}`);
    labelForA.setAttribute('for',`answer-${3*(id -1)}`);
    
    answerB.setAttribute('id',`answer-${3*(id -1)+1}`);
    labelForB.setAttribute('for',`answer-${3*(id -1)+1}`);
    
    answerC.setAttribute('id',`answer-${3*(id -1)+2}`);
    labelForC.setAttribute('for',`answer-${3*(id -1)+2}`);

    labelForA.textContent = answersSeparated[0];
    labelForB.textContent = answersSeparated[1];
    labelForC.textContent = answersSeparated[2];

    //appendChild
    wrapper.appendChild(task);
    
    wrapper.appendChild(question);
    
    wrapper.appendChild(document.createElement('br'))
    
    wrapper.appendChild(answerA);
    wrapper.appendChild(labelForA);

    wrapper.appendChild(document.createElement('br'))

    wrapper.appendChild(answerB);
    wrapper.appendChild(labelForB);

    wrapper.appendChild(document.createElement('br'))

    wrapper.appendChild(answerC);
    wrapper.appendChild(labelForC);

}