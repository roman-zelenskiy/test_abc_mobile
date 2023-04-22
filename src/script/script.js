import data from '../data/data.json' assert {type: 'json'};

// open menu burger
const burgerBtn = document.querySelector('.main_menu .burger_btn');
const menuCollapse = document.querySelector('.main_menu .menu_collapse')

burgerBtn.addEventListener('click', onClickBurgerBtn)

function onClickBurgerBtn() {
    burgerBtn.classList.toggle('active');
    menuCollapse.classList.toggle('active');
}



// switch slide
const hiddenBoxHeader = document.getElementsByClassName('hidden_box_header')[0];
const btnPassTest = document.querySelectorAll('.btn_pass_test');
let temlpateBasic = document.getElementById('test_template_basic1').innerHTML;
let itemTemplate = document.getElementById('template_item_radio').innerHTML;
let resultsProcessingTemplate = document.getElementById('results_processing').innerHTML;
let resultsReadyTemplate = document.getElementById('results_ready').innerHTML;
let answerDataTemplate = document.getElementById('template_answer_data').innerHTML;

let counter = 1;

const onClickBtnPassTest = (element) => {
    function onHandler() {
        hiddenBoxHeader.className = "hidden_box_header visible_title_nav_test";
        renderTemplate(temlpateBasic, itemTemplate, data)
    }
    element.addEventListener('click', onHandler)
}

function foraechVar(elements, func) {
    for (let element of elements) {
        func(element);
    }
}
foraechVar(btnPassTest, onClickBtnPassTest);

function renderTemplate(basicTemlpate, itemTemplate, data) {
    let newElement = document.createElement(`div`);
    newElement.className = `question_box`;
    document.body.append(newElement);
    resultsProcessingRender();
    resultsReady();
    data.forEach((element, index) => {
        if (index === (counter - 1) && counter !== data.length + 2 && counter !== data.length + 1) {
            insertData(newElement, element, basicTemlpate);
            renderItemsTemplate(itemTemplate, element)
            testВifferenceСhecks(element);
            questionSlideFunc();
        }
        return false;
    });
    function insertData(element, data, temlpate) {
        element.innerHTML = temlpate;
        Object.keys(data).forEach((key, index) => {
            if (temlpate.includes(`{{${key}}}`)) {
                element.innerHTML = `${element.innerHTML.replaceAll(`{{${key}}}`, data[key])}`;
            }
        })
    }
    function renderItemsTemplate(temlpate, data) {
        data.options.forEach((option, index) => {
            let item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML += temlpate
                .replaceAll(`{{option_text}}`, option)
                .replaceAll(`{{id}}`, data.id)
                .replaceAll(`{{index_option}}`, index);
            newElement.querySelector('.item_box').append(item);
        })
    }

    function changeCounter() {
        newElement.remove();
        renderTemplate(temlpateBasic, itemTemplate, data)
    }

    function onSwitchQuestion() {
        ++counter;
        newElement.className = `question_box question_${counter}`;
        changeCounter();
    }

    function testВifferenceСhecks(dataElement) {
        if (dataElement.img) {
            newElement.querySelector('.img_question').classList.add('active');
        }
        if (!dataElement.hiddenText) {
            let func = (element) => {
                element.classList.add('active');
            }
            foraechVar(newElement.querySelectorAll('.text_radio'), func)
        };
        if (dataElement.otherRadio) {
            newElement.querySelector('.item_box').className = "select_radio_color item_box";
        }
    }
    function resultsProcessingRender() {
        if (counter === data.length + 1) {
            newElement.classList.add('results_processing');
            newElement.innerHTML = resultsProcessingTemplate;
            setTimeout(() => {
                counter++;
                changeCounter();
            }, 1000);
        }
    }

    function resultsReady() {
        if (counter === data.length + 2) {
            newElement.classList.add('results_ready');
            hiddenBoxHeader.className = "hidden_box_header visible_title_ready";
            newElement.innerHTML = resultsReadyTemplate;
            timer(newElement);
            sendRequest();
        }
    }

    function questionSlideFunc() {
        newElement.className = `question_box question_${counter}`;
        let btnNextQuestion = newElement.querySelector('.next_question');
        btnNextQuestion.removeEventListener('click', () => onSwitchQuestion());
        btnNextQuestion.addEventListener('click', () => onSwitchQuestion());
        validationCompletedform(newElement);
    }
    function sendRequest() {
        const callBtn = document.getElementById('call_btn');
        callBtn.addEventListener('click', onClickCallBtn);
        const url = 'https://swapi.dev/api/people/1/';

        function onClickCallBtn() {
            sendGetRequest(url);
        }
        function sendGetRequest(url) {
            fetch(url)
                .then(response => response.json()
                .then(response => {
                    renderResponse(newElement, response, answerDataTemplate)
                }));
        }
        function renderResponse(element, response, temlpate) {
            newElement.classList.add('answer_data');
            hiddenBoxHeader.className = "hidden_box_header";
            element.innerHTML = temlpate;
            for (let el in response) {
                element.innerHTML = `${element.innerHTML.replaceAll(`{{${el}}}`, response[el])}`;
            }
        }
    }
}

function validationCompletedform(parenBoxForm) {
    const btnNextQuestion = parenBoxForm.querySelector('.next_question');
    btnNextQuestion.disabled = true;
    const changeInput = (input) => {
        function onHandler(e) {
            if (input.checked) {
                btnNextQuestion.disabled = false;
                return false;
            }
            if (!input.checked) {
                btnNextQuestion.disabled = true;
                return false;
            }
        }
        input.addEventListener('change', onHandler)
    }
    foraechVar(parenBoxForm.querySelectorAll('input[type="radio"]'), changeInput)
}




// timer
function timer(resultsReadyBox) {
    const timer = document.getElementById('timer_js');
    let start = 10;
    let seconds = start * 60;
    timer.textContent = '10:00';
    setInterval(() => {
        const currentSeconds = (seconds % 60 === 0) ? '00' : seconds % 60;
        timer.textContent = Math.floor(seconds / 60) + ':' + currentSeconds;
        --seconds
        if (timer.innerText === '0:00') {
            resultsReadyBox.remove();
            counter = 1;
            hiddenBoxHeader.className = "hidden_box_header";
        }
    }, 1000);
}

