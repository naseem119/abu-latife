class Answers {
    constructor(answerElement, answerText) {
        this.answerElement = answerElement
        this.answerText = answerText;
    }
}

// global reset values
let curr_question = 0;
let countdownInterval;
let quiz_done = false;
// store the quiz data
let json_file;
// store the user_answers
let user_answers = [];
let question_numbers = document.getElementById("question-numbers");
// get the quiz block and hide it initially
let quiz_block = document.getElementById("quiz-page");
quiz_block.style.display = "none";
// push the button and it's text from
let select_quiz_section = document.getElementById("select-quiz-section");
select_quiz_section.style.marginTop = "100px";
// element for quiz type
let quiz_type = document.getElementById("quiz-type");
let quiz_type_str = quiz_type.textContent;
let questions_count_element = document.getElementById("question-count");
// get the quiz directory and set the size according to quiz type
let quiz_directory_str;
let quiz_directory_size = 0;

let questions_buttons;
let questions_buttons_spans;
let result = document.getElementById("result");
result.style.display = "none";
let timer = document.getElementById("timer");
//
let quizzes_buttons = document.getElementById("quizzes");
if (quiz_type_str === "الامتحان: خصوصي") {
    quiz_directory_str = "../Quizzes/private";
    quiz_directory_size = 25;
} else if (quiz_type_str === "الامتحان: شحن") {
    quiz_directory_str = "../Quizzes/trucks";
    quiz_directory_size = 31;
} else if (quiz_type_str === "الامتحان: باص و عمومي") {
    quiz_directory_str = "../Quizzes/bus";
    quiz_directory_size = 22;
} else if (quiz_type_str === "الامتحان: دراجة نارية") {
    quiz_directory_str = "../Quizzes/motor";
    quiz_directory_size = 9;
}

for (let i = 1; i <= quiz_directory_size; i++) {
    let temp_str;
    if (i < 10) {
        temp_str = "0" + i;
    } else {
        temp_str = "" + i;
    }
    quizzes_buttons.innerHTML += "<button type=\"button\" class=\"choose-quiz-btn\">" + "إمتحان " + temp_str + "</button>";
}
// question text and answers buttons
let question = document.getElementById("question-text");
let answers_temp = document.getElementsByClassName("answer-btn");
let answers = [];
for (let i = 0; i < answers_temp.length; i++) {
    answers.push(new Answers(answers_temp[i], ""));
    answers[i].answerElement.addEventListener("click", function () {
        user_answers[curr_question] = answers[i].answerText;
        for (let j = 0; j < answers_temp.length; j++) {
            answer_buttons_spans[j].classList.remove("answer-btn-span-selected");
        }
        answer_buttons_spans[i].classList.add("answer-btn-span-selected");
    });
}

let prev_btn = document.getElementById("previous");
let next_btn = document.getElementById("next");
prev_btn.addEventListener("click", function () {
    curr_question--;
    setQuestion();
});
next_btn.addEventListener("click", function () {
    curr_question++;
    setQuestion();
});

let quiz_select_buttons = document.getElementsByClassName("choose-quiz-btn");
for (let i = 0; i < quiz_select_buttons.length; i++) {
    quiz_select_buttons[i].style.fontSize = "20px";
    quiz_select_buttons[i].addEventListener("click", function () {
        for (let j = 0; j < quiz_select_buttons.length; j++) {
            quiz_select_buttons[j].style.fontSize = "16px";
            quiz_select_buttons[j].classList.remove("choose-quiz-btn-selected");
        }
        for (let i = 0; i < answers.length; i++) {
            answers[i].answerElement.removeAttribute("disabled");
            answer_buttons_spans[i].classList.remove("good");
            answer_buttons_spans[i].classList.remove("bad");
        }
        quiz_select_buttons[i].classList.add("choose-quiz-btn-selected");
        quiz_done = false;
        curr_question = 0;
        result.style.display = "none";
        quiz_block.style.display = "flex";
        select_quiz_section.style.marginTop = "0px";
        startQuiz(i + 1);
        quiz_type.innerHTML = quiz_type_str + " " + (i + 1);
    });
}

function readJsonLine(str) {
    let tempInnerHtml = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '[') {
            let imgNum = "";
            i++;
            while (str[i] !== ']') {
                imgNum += str[i];
                i++;
            }
            tempInnerHtml += " <img class='question-img' src=\"../images/traffic_signs_visual/" + imgNum + ".jpg\" alt='none'> "
            imgNum = "";
        } else {
            tempInnerHtml += str[i];
        }
    }
    return tempInnerHtml;
}

let answer_buttons_spans = document.getElementsByClassName("answer-btn-span");

function setQuestion() {
    if (curr_question === 0)
        prev_btn.style.visibility = 'hidden';
    else
        prev_btn.style.visibility = 'visible';
    if (curr_question === (json_file.length - 1))
        next_btn.style.visibility = 'hidden';
    else
        next_btn.style.visibility = 'visible';
    for (let i = 0; i < questions_buttons.length; i++) {
        questions_buttons[i].classList.remove("select-question-span-current");
    }
    questions_buttons[curr_question].classList.add("select-question-span-current");


    question.innerHTML = "" + (curr_question + 1) + "- " + readJsonLine(json_file[curr_question].question);

    answers[0].answerText = json_file[curr_question].o1;
    answers[1].answerText = json_file[curr_question].o2;
    answers[2].answerText = json_file[curr_question].o3;
    answers[3].answerText = json_file[curr_question].o4;
    for (let i = 0; i < answers.length; i++) {
        answer_buttons_spans[i].classList.remove("good");
        answer_buttons_spans[i].classList.remove("bad");
        if (answers[i].answerText === user_answers[curr_question] && user_answers[curr_question] !== "")
            answer_buttons_spans[i].classList.add("answer-btn-span-selected");
        else
            answer_buttons_spans[i].classList.remove("answer-btn-span-selected");
    }
    answers[0].answerElement.innerHTML = readJsonLine(json_file[curr_question].o1);
    answers[1].answerElement.innerHTML = readJsonLine(json_file[curr_question].o2);
    answers[2].answerElement.innerHTML = readJsonLine(json_file[curr_question].o3);
    answers[3].answerElement.innerHTML = readJsonLine(json_file[curr_question].o4);
}

function checkAnswers() {

    for (let i = 0; i < answers.length; i++) {
        answer_buttons_spans[i].classList.remove("good");
        answer_buttons_spans[i].classList.remove("bad");
        if (answers[i].answerText === json_file[curr_question].answer) {
            answer_buttons_spans[i].classList.add("good");
            console.log("as");
            continue;
        }
        if (answers[i].answerText === user_answers[curr_question] && user_answers[curr_question] !== "")
            answer_buttons_spans[i].classList.add("bad");
    }
}

function setQuestionsButtons(size) {
    question_numbers.innerHTML = "";
    for (let i = 0; i < size; i++) {
        question_numbers.innerHTML += "<span class=\"select-question-span\"><button type=\"button\" class='select-question-button'>" + (i + 1) + "</button></span>\n"
    }
    questions_buttons = document.getElementsByClassName("select-question-button");
    questions_buttons_spans = document.getElementsByClassName("select-question-span");
    for (let i = 0; i < questions_buttons.length; i++) {
        questions_buttons[i].addEventListener("click", function () {
            if (user_answers[curr_question] === "")
                questions_buttons_spans[curr_question].classList.remove("select-question-span-selected");
            else
                questions_buttons_spans[curr_question].classList.add("select-question-span-selected");

            questions_buttons_spans[curr_question].classList.remove("select-question-span-current");
            curr_question = i;
            setQuestion();
            questions_buttons_spans[curr_question].classList.add("select-question-span-current");
        });
    }
}

function startQuiz(quizNumber) {
    clearInterval(countdownInterval)
    countdown(40 * 60);
    let curr_directory = quiz_directory_str + "/quiz" + quizNumber + ".json";
    curr_question = 0;
    console.log(curr_directory);
    fetch(curr_directory)
        .then(response => response.json())
        .then(data => {
            questions_count_element.innerText = "عدد الأسئلة: " + data.length;
            json_file = data;
            setQuestionsButtons(data.length);
            for (let i = 0; i < data.length; i++) {
                user_answers.push("");
            }
            setQuestion(); // Call setQuestion() here or pass json_file to it if needed
        })
        .catch(error => {
            // Handle any fetch errors here
            console.error('Error fetching data:', error);
        });
}

let finishBtn = document.getElementById("finish-quiz");
finishBtn.addEventListener("click", function () {
    finishQuiz();
});

function finishQuiz() {
    let score = 0;
    for (let i = 0; i < json_file.length; i++) {
        questions_buttons_spans[i].classList.remove("select-question-span-selected");
        questions_buttons_spans[i].classList.remove("select-question-span-current");
        if (user_answers[i] === json_file[i].answer) {
            console.log(i, "\n")
            score++;
            questions_buttons_spans[i].classList.add("good");
        } else {
            questions_buttons_spans[i].classList.add("bad");
        }
    }
    for (let i = 0; i < answers.length; i++) {
        answers[i].answerElement.setAttribute('disabled', 'disabled');
    }
    quiz_done = true;
    result.innerText = score + "/" + json_file.length;
    result.style.display = "inline-flex";
    result.classList.remove("good");
    result.classList.remove("bad");
    if (score >= json_file.length - 5) {
        result.classList.add("good");
        result.innerText += '\nناجح!'
    } else {
        result.classList.add("bad");
        result.innerText += '\nراسب!'
    }
    checkAnswers();
}

let check_btn = document.getElementById("check-answer");
check_btn.addEventListener("click", function () {
    checkAnswers();
})

function countdown(duration) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);

        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        timer.innerHTML = `${minutes}:${seconds}`;
        if (duration <= 60) {
            timer.classList.add("bad");
        }else{
            timer.classList.remove("bad");
        }
        if (--duration < 0) {
            clearInterval(countdownInterval);
            finishQuiz();
        }

    }, 1000);

}