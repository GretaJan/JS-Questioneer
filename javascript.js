/******************************* 
**********QUIZ CONTROLER********
********************************/

var quizController = (function() {
// ***************Question Constructor*****************
    function Question(id, questionTxt, opt, correctAnsw){
        this.id = id;
        this.questionTxt = questionTxt;
        this.opt = opt;
        this.correctAnsw = correctAnsw;
    }

    var questionLocalStorage = {
        setQuestionCollection: function(newCollection){
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        getQuestionCollection: function(){
            return (JSON.parse(localStorage.getItem('questionCollection')));
        },
        removeQuestionCollection: function(){
            localStorage.removeItem('questionCollection');
        }
    };

    if(questionLocalStorage.getQuestionCollection() === null){
        questionLocalStorage.setQuestionCollection([]);
    };

    var quizProgress = {
        questionIndex: 0,
    };

    //***********************PERSON CONSTRUCTOR********************* */

    function Person(id, name, surname, score){
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.score = score;
    };

    var currPersonData = {
        fullname: [],
        score: 0
    };

    var adminFullName = ['Greta', 'Jan'];

    var personLocalStorage = {

        setPersonData: function(newPersonData){
            localStorage.setItem('personData', JSON.stringify(newPersonData));
        },
        getPersonData: function(){
            return JSON.parse(localStorage.getItem('personData'));
        },
        removePersonData: function(){
            localStorage.removeItem('personData');
        }
    };

    if(personLocalStorage.getPersonData() === null){
        personLocalStorage.setPersonData([]);
    }
    
    return {

        getQuizProgress: quizProgress, 

        getQuestionLocalStorage: questionLocalStorage,

        addQuestionOnLocalStorage: function(newQuestTxt, opts){
            var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;

            optionsArr = [];
        
            if(questionLocalStorage.getQuestionCollection() === null){
                questionLocalStorage.setQuestionCollection([]);
            }
            
            isChecked = false;

            for(var i = 0; i < opts.length; i++){
                if(opts[i].value !== ""){
                    optionsArr.push(opts[i].value);
                }
                if(opts[i].previousElementSibling.checked && opts[i].value !== ""){
                    corrAns = opts[i].value;
                    isChecked = true;
                }
            }
            

            if(questionLocalStorage.getQuestionCollection().length > 0){
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
            } else {
                questionId = 0;
            }

            if(newQuestTxt.value !== ""){
                if(optionsArr.length > 1){
                    if(isChecked){
                        newQuestion = new Question(questionId, newQuestTxt.value, optionsArr, corrAns);

                        getStoredQuests = questionLocalStorage.getQuestionCollection();

                        getStoredQuests.push(newQuestion);
                        questionLocalStorage.setQuestionCollection(getStoredQuests);

                        newQuestTxt.value = "";

                        for (var j = 0; j < opts.length; j++){
                            opts[j].value = "";
                            opts[j].previousElementSibling.checked = false;
                        }
                        console.log(questionLocalStorage.getQuestionCollection);

                        return true;
                    } else {
                            alert("Please, mark a correct answer");
                            return false;
                    } 
                } else {
                        alert('Please, insert at least 2 options');
                        return false;
                }
            } else {
                    alert('Please, insert Question');
                    return false;
            }
        },

        checkAnswer: function(ans){
            if(questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnsw === ans.textContent) {

                this.getCurrentPersonData.score++;
                return true;
            } else {
                return false;
            }   
        },

        isFinished: function(){
            
            return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;
        },

        addPerson: function(){
            var newPerson,personId, personData;

            if(personLocalStorage.getPersonData().length > 0){
                personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length -1].id + 1;
            } else {
                personId = 0;
            }

            newPerson = new Person(personId, currPersonData.fullname[0], currPersonData.fullname[1], currPersonData.score);
       
            personData = personLocalStorage.getPersonData();

            personData.push(newPerson);

            personLocalStorage.setPersonData(personData);
       
       
            console.log(newPerson);
        },

        getCurrentPersonData: currPersonData,
        getAdminFullName: adminFullName,
        getPersonLocalStorage: personLocalStorage,

    };
})();

/******************************* 
**********UI CONTROLER**********
********************************/

var UIController = (function() {
    var domItems = {
 //*****************ADMIN PANEL************************ 
        adminPanelSection: document.querySelector('.admin-panel-container'),
        questInsertBtn: document.getElementById('question-insert-btn'),
        newQuestionText: document.getElementById('new-question-text'),
        adminOptions: document.querySelectorAll(".admin-option"),
        adminOptionsContainer: document.querySelector('.admin-options-container'),
        insertedQuestionsWrapper: document.querySelector('.inserted-questions-wrapper'),
        questUpdateBtn: document.getElementById('question-update-btn'),
        questDeleteBtn: document.getElementById('question-delete-btn'),
        questsClearBtn: document.getElementById('questions-clear-btn'),
        userResultList: document.querySelector('.results-list-wrapper'),
        userResultDeleteBtn: document.querySelector('.delete-result-btn'),
        usersClearBtn: document.getElementById('results-clear-btn'),
   //*****************************************USER PANEL**********************************************/
        quizSection: document.querySelector('.quiz-container'),
        askedQuestionText:document.getElementById('asked-question-text'),
        quizOptionsWrapper: document.querySelector('.quiz-options-wrapper'),
        progressBar: document.querySelector('progress'),
        progressPar: document.getElementById("progress"),
        instAnsContainer: document.querySelector('.instant-answer-container'),
        instAnsText: document.getElementById('instant-answer-text'),
        instAnswerDiv: document.getElementById('instant-answer-wrapper'),
        emotionIcon: document.getElementById('emotion'),
        nextQuestionBtn: document.getElementById('next-question-btn'),
    //***********************LANDING PAGE ELEMENTS*************************************************** */
        landingPageSection: document.querySelector('.landing-page-container'),
        startQuiz: document.getElementById('start-quiz-btn'),
        firstNameInput: document.getElementById('firstname'),
        lastNameInput: document.getElementById('lastname'),
    //***********************FINAL RESULT***************************************************** */
        finalScoreText: document.getElementById('final-score-text'),
        finalResultContainer: document.querySelector('.final-result-container'),

        filter: document.querySelector('.result-filter'),
        filterInput: document.getElementsByTagName('input'),
        p: document.querySelector('.p'),

    };

    return {
        getDomItems: domItems,
        addInputsDinamically: function(){
            var addInput = function(){
                var inputHTML, z;

                z = document.querySelectorAll('.admin-option').length;

                inputHTML =  '<div class="admin-option-wrapper"><input type="radio" class="admin-option-'+ z + '" name="answer" value="'+ z + '"><input type="text" class="admin-option admin-option-'+ z +'" name="answer" value=""></div>';
                
                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);

                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
                
                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
            }
            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        },

        createQuestionList: function(getQuest) {
                var questHTML, numberingArr;
                numberingArr = [];
                domItems.insertedQuestionsWrapper.innerHTML = "";

                for(var i = 0; i < getQuest.getQuestionCollection().length; i++){
                    numberingArr.push(i + 1);
                    questHTML = '<p><span>' + numberingArr[i] + '. ' + getQuest.getQuestionCollection()[i].questionTxt + '</span></p><button id="question-' + getQuest.getQuestionCollection()[i].id + '">Edit</button>';

                    domItems.insertedQuestionsWrapper.insertAdjacentHTML('afterbegin', questHTML);
                }
        },

        editQuestionList: function(event, storageQuestList, addInputsDinamicallyFn, updateQuestionListFn){
            var getId, getStorageQuestList, foundItem, placeInArr, optionHTML;

            if('question-'.indexOf(event.target.id)){

                getId = parseInt(event.target.id.split('-')[1]);
                
                getStorageQuestList = storageQuestList.getQuestionCollection();

                for(var i = 0; i < getStorageQuestList.length; i++){

                    if(getStorageQuestList[i].id === getId){
                        foundItem = getStorageQuestList[i];

                        placeInArr = i;
                    }
                }

                domItems.newQuestionText.value = foundItem.questionTxt;
                domItems.adminOptionsContainer.innerHTML = "";
                optionHTML = '';

                for(var j = 0; j < foundItem.opt.length; j++){
                    optionHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + j + '" name="answer" value="' + j + '"><input type="text" class="admin-option admin-option-' + j + '" name="answer" value="' + foundItem.opt[j] + '"></div>';
                }

                domItems.adminOptionsContainer.innerHTML = optionHTML;

                domItems.questUpdateBtn.style.visibility = 'visible';
                domItems.questDeleteBtn.style.visibility = 'visible';
                domItems.questInsertBtn.style.visibility = 'hidden';
                domItems.questsClearBtn.style.pointerEvents = 'none';

                addInputsDinamicallyFn();
                
                var backDefaultView = function(){
                    var updatedOptions;
                    domItems.newQuestionText.value = '';

                    updatedOptions = document.querySelectorAll(".admin-option");

                    for(var i = 0; i < updatedOptions.length; i++){
                        updatedOptions[i].value = '';
                        updatedOptions[i].previousElementSibling.checked = false;
                    }

                    domItems.questUpdateBtn.style.visibility = 'hidden';
                    domItems.questDeleteBtn.style.visibility = 'hidden';
                    domItems.questInsertBtn.style.visibility = 'visible';
                    domItems.questsClearBtn.style.pointerEvents = '';

                    updateQuestionListFn(storageQuestList);
                }

                var updateQuestion = function(){
                    var newOptions;

                    newOptions = [];
                    

                    foundItem.questionTxt = domItems.newQuestionText.value;
                    foundItem.correctAnsw = '';

                    for(var i = 0; i < optionEls.length; i++){
                        if(optionEls[i].value !== ''){
                            newOptions.push(optionEls[i].value);
                            if(optionEls[i].previousElementSibling.checked){
                                foundItem.correctAnsw = optionEls[i].value;
                            }
                        }
                    }

                    foundItem.opt = newOptions;
                    
                    if(foundItem.questionTxt !== ''){
                        if(foundItem.opt.length > 1){
                            if(foundItem.correctAnsw !== ''){
                        getStorageQuestList.splice(placeInArr, 1, foundItem);

                        storageQuestList.setQuestionCollection(getStorageQuestList);

                        backDefaultView();

                    } else {
                        alert('Please check correct answer');
                    }
                    }  else {
                                alert('You must provide two or more options');
                            }
                    } else {
                        alert('Please fill in text field');
                    }
                }
                domItems.questUpdateBtn.onclick = updateQuestion;

                var deleteQuestion = function(){
                   
                    getStorageQuestList.splice(placeInArr, 1);

                    storageQuestList.setQuestionCollection(getStorageQuestList);

                    backDefaultView();
                }

                domItems.questDeleteBtn.onclick = deleteQuestion;
            }
        },
        clearQuestionList: function(storageQuestList){
            if(storageQuestList.getQuestionCollection() !== null){
                if(storageQuestList.getQuestionCollection().length > 0){
                    
                    var conf = confirm('Warning! You will lose entire question list');

                    if(conf){
                        storageQuestList.removeQuestionCollection();
                        domItems.insertedQuestionsWrapper.innerHTML = '';
                    }
                }
            }
        },
        //*****************************************USER PANEL**********************************************/
        displayQuestion: function(storageQuestList, progress){
            var newOptionHTML, characterArr;

            characterArr = ['A', 'B', 'C', 'D', 'E', 'F'];

            if(storageQuestList.getQuestionCollection().length > 0){
                domItems.askedQuestionText.textContent = storageQuestList.getQuestionCollection()[progress.questionIndex].questionTxt;
                
                domItems.quizOptionsWrapper.innerHTML = '';
                for(var i = 0; i < storageQuestList.getQuestionCollection()[progress.questionIndex].opt.length; i++){
                    newOptionHTML = '<div class="choice-'+ i + '"><span class="choice-'+ i +'">' + characterArr[i] + '</span><p class="choice-' + i + '">' + storageQuestList.getQuestionCollection()[progress.questionIndex].opt[i] + '</p>';
                
                    domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
                }
            }
        },

        displayProgress: function(storageQuestList, progress){
            domItems.progressBar.max = storageQuestList.getQuestionCollection().length;
            domItems.progressBar.value = progress.questionIndex + 1;

            domItems.progressPar.textContent = (progress.questionIndex + 1) + '/' + (storageQuestList.getQuestionCollection().length);
        },

            newDesign: function(ansResult, selectedAnsw){
                var twoOptions, index;

                index = 0;

                if (ansResult){
                    index = 1;
                }

                twoOptions = {
                    instAnswerText: ['This is a wrong answer', 'This is a correct answer'],
                    instAnswerClass: ['red', 'green'],
                    emotionType: ['css/images/sad.jpg', 'css/images/happy.jpg'],
                    optionSpanBg: ['rgba(200, 0, 0, .7)', 'rgba(0, 250, 0, .7)'],
                };

                domItems.quizOptionsWrapper.style.cssText = "opacity: 0.6; pointer-events: none;";
                domItems.instAnsContainer.style.opacity = "1";
                domItems.instAnsText.textContent = twoOptions.instAnswerText[index];
                domItems.instAnswerDiv.className = twoOptions.instAnswerClass[index];
                domItems.emotionIcon.setAttribute('src', twoOptions.emotionType[index]);
                selectedAnsw.previousElementSibling.style.background = twoOptions.optionSpanBg[index];
            },

            resetDesign: function(){
                domItems.quizOptionsWrapper.style.cssText = "";
                domItems.instAnsContainer.style.opacity = "0";
            },

            getFullName: function(currPerson, storageQuestList, admin){
                if(domItems.firstNameInput.value !== '' && domItems.firstNameInput.value !== ''){
                    if(!(domItems.firstNameInput.value === admin[0] && domItems.lastNameInput.value === admin[1])){
                        if(storageQuestList.getQuestionCollection().length > 0){
                            currPerson.fullname.push(domItems.firstNameInput.value);
                            currPerson.fullname.push(domItems.lastNameInput.value);
                            domItems.landingPageSection.style.display = 'none';
                            domItems.quizSection.style.display = 'block';
                            console.log(currPerson);
                        } else {
                            alert('Quiz is not ready, please contant administrator');
                        }
                    } else {
                        domItems.landingPageSection.style.display = 'none';
                        domItems.adminPanelSection.style.display = 'block';
                    }
                }   else {
                        alert('Please enter both: first name and last name');
                }
            },

            finalResult: function (currPerson){
                domItems.finalScoreText.textContent = currPerson.fullname[0] + ' ' +currPerson.fullname[1] + ', your current score is ' + currPerson.score;
            
            domItems.quizSection.style.display = 'none';
            domItems.finalResultContainer.style.display = 'block';
            }, 

            addResultOnPanel: function(userData){
                var resultHTML;

                domItems.userResultList.innerHTML = '';

                for(var i = 0; i < userData.getPersonData().length; i++){
                    resultHTML = '<p class= "p" class="person person-' + i + '"><span class="person-' + i + '">' + userData.getPersonData()[i].name + ' " " ' + userData.getPersonData()[i].surname + ' - ' + userData.getPersonData()[i].score + ' points</span><button id="delete-result-btn_' + userData.getPersonData()[i].id + '" class="delete-result-btn">Delete</button></p>';
                    domItems.userResultList.insertAdjacentHTML('afterbegin', resultHTML);
                }
            },

            deleteResultInAdmin: function(e, personData) {
                var getId, personsArr;

                personsArr = personData.getPersonData();


                if('delete-result-btn_'.indexOf(event.target.id)){
                    getId = parseInt(event.target.id.split('_')[1]);
                    for(var i = 0; i < personsArr.length; i++){
                        if(getId === personsArr[i].id){

                            personsArr.splice(i, 1);

                            personData.setPersonData(personsArr);
                        }
                    }
                }
            },

            clearPersonsData: function(personsData){

                if(personsData.getPersonData().length !== null) {
                    if(personsData.getPersonData().length > 0){

                        var needConfirm = confirm('Are you sure you want to clear the users list?');

                        if(needConfirm){
                            personsData.removePersonData();
                            alert('Data removed');
                            domItems.userResultList.innerHTML = '';
                        }
                    }
                }
            },

            filterMethod: function(userData) {
                var inputValue, resultHTML;

                inputValue = domItems.filter.value;
                domItems.userResultList.innerHTML = '';
                for(var i = 0; i < userData.getPersonData().length; i++) {
                    
                    var nameData = userData.getPersonData()[i].name.toLowerCase();
                    var surnameData = userData.getPersonData()[i].surname.toLowerCase();
                    console.log(inputValue);

                    if(nameData.indexOf(inputValue) > -1 || surnameData.indexOf(inputValue) > -1) {
                         
                        resultHTML = '<p class= "p" class="person person-' + i + '"><span class="person-' + i + '">' + userData.getPersonData()[i].name + ' " " ' + userData.getPersonData()[i].surname + ' - ' + userData.getPersonData()[i].score + ' points</span><button id="delete-result-btn_' + userData.getPersonData()[i].id + '" class="delete-result-btn">Delete</button></p>';
                    } else {
                        resultHTML = '';
                    }
                    domItems.userResultList.insertAdjacentHTML('afterbegin', resultHTML);

                }
            }
    };
})();

/******************************* 
**********MAIN CONTROLLER********
********************************/

var controller = (function(quizCntrl, UICntrl) {

    var selectedDomItems = UICntrl.getDomItems;
    
    UIController.addInputsDinamically();
    UICntrl.createQuestionList(quizCntrl.getQuestionLocalStorage);

    selectedDomItems.questInsertBtn.addEventListener('click', function(){
        var adminOptions = document.querySelectorAll(".admin-option");

    var checkBoolean = quizCntrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);
    
    if(checkBoolean){
        UICntrl.createQuestionList(quizCntrl.getQuestionLocalStorage);
    }

});

    selectedDomItems.insertedQuestionsWrapper.addEventListener('click', function(e){
        UICntrl.editQuestionList(e, quizCntrl.getQuestionLocalStorage, UICntrl.addInputsDinamically, UICntrl.createQuestionList);
    });

    selectedDomItems.questsClearBtn.addEventListener('click', function(){
        UICntrl.clearQuestionList(quizCntrl.getQuestionLocalStorage);
    });

     //*****************************************USER PANEL**********************************************/

     UICntrl.displayQuestion(quizCntrl.getQuestionLocalStorage, quizCntrl.getQuizProgress);
     UICntrl.displayProgress(quizCntrl.getQuestionLocalStorage, quizCntrl.getQuizProgress);
     selectedDomItems.quizOptionsWrapper.addEventListener('click', function(e){
        console.log(e);
        var updatedOptionsDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll('div');

        for(var i = 0; i < updatedOptionsDiv.length; i++){
            if(e.target.className === 'choice-' + i){
                var answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);
                console.log('answer');
                var answerResult = quizCntrl.checkAnswer(answer);

                UICntrl.newDesign(answerResult, answer);

                if(quizCntrl.isFinished()){
                    selectedDomItems.nextQuestionBtn.textContent = "Finish";
                }

                var nextQuestion = function(questData, progress){

                    if(quizCntrl.isFinished()){
                        
                        quizCntrl.addPerson();

                        UICntrl.finalResult(quizCntrl.getCurrentPersonData);

                    } else {
                        UICntrl.resetDesign();
                        progress.questionIndex++;
                        UICntrl.displayQuestion(quizCntrl.getQuestionLocalStorage, quizCntrl.getQuizProgress);
                        UICntrl.displayProgress(quizCntrl.getQuestionLocalStorage, quizCntrl.getQuizProgress);
                    }

                };

                selectedDomItems.nextQuestionBtn.onclick = function(){
                    nextQuestion(quizCntrl.getQuestionLocalStorage, quizCntrl.getQuizProgress);
                }
            }
        }
     });
      //***********************LANDING PAGE ELEMENTS*************************************************** */

      selectedDomItems.startQuiz.addEventListener('click', function(){
          UICntrl.getFullName(quizCntrl.getCurrentPersonData, quizCntrl.getQuestionLocalStorage, quizCntrl.getAdminFullName);
      });

      selectedDomItems.lastNameInput.addEventListener('focus', function(){

        selectedDomItems.lastNameInput.addEventListener('keypress', function(e){

            if(e.keyCode === 13){
                UICntrl.getFullName(quizCntrl.getCurrentPersonData, quizCntrl.getQuestionLocalStorage, quizCntrl.getAdminFullName);
            }
        })
      });

      UICntrl.addResultOnPanel(quizCntrl.getPersonLocalStorage);
      selectedDomItems.userResultList.addEventListener('click', function(e){
          UICntrl.deleteResultInAdmin(e, quizCntrl.getPersonLocalStorage);
          UICntrl.addResultOnPanel(quizCntrl.getPersonLocalStorage);

      });

      selectedDomItems.usersClearBtn.addEventListener('click', function(){
          console.log();
          UICntrl.clearPersonsData(quizCntrl.getPersonLocalStorage);
      });


      selectedDomItems.filter.addEventListener('keyup', function() {
          UICntrl.filterMethod(quizCntrl.getPersonLocalStorage);
      });

})(quizController, UIController);

