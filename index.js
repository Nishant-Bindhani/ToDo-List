var btns = document.querySelectorAll('.btns button'),
    popup = document.querySelector('.popup'),
    showChange = document.querySelector('.showChange'),
    penTaskFilter = document.querySelector('#penTaskFilter'),
    comTaskFilter = document.querySelector('#comTaskFilter'),
    pendingTodos = document.querySelector('.pendingTodos'),
    completeTodos = document.querySelector('.completeTodos'),
    completeNum = document.querySelector('.completeNum'),
    addInputField = document.querySelector('.addInputField'),
    editInputField = document.querySelector('.editInputField'),
    addTaskBtn = document.querySelector('.addTask'),
    pendingNum = document.querySelector('.pendingNum'),
    saveTaskBtn = document.querySelector('.saveTask'),
    deleteAllPenTodos = document.querySelector('.penTodos button'),
    todoList = document.querySelectorAll('.todoList'),
    deleteAllComTodos = document.querySelector('.comTodos button'),
    pending = document.querySelector(".pending"),
    completeTasks = document.querySelector('.completeTask');

//For pending button//
btns[0].addEventListener('click', () => {
    showChange.style.left = "0%"; // shifting of indicator white box when switching btw pending and completed //
    btns[0].style.pointerEvents = "none"; // when on the pending block the cursor display gets hidden//
    btns[1].style.pointerEvents = "auto"; // when on the pending block the cursor display is in auto mode for complete block //
    penTaskFilter.style.display = "block"; //filter box of pending becomes block lv//
    comTaskFilter.style.display = "none"; // filter box of completed gets hidden//
    pendingTodos.style.display = "block"; // pending task block set to block lv //
    completeTodos.style.display = "none"; // complete task block gets hidden //
    todoList.forEach(todo => {
        todo.offsetHeight >= 320 ? todo.classList.add('overflow') : todo.classList.remove('overflow'); //offsetHeight of ul list blocks greater than 320 will have overflow class
    });

});

btns[1].addEventListener('click', () => {
    showChange.style.left = "50%";
    btns[0].style.pointerEvents = "auto";
    btns[1].style.pointerEvents = "none";
    penTaskFilter.style.display = "none";
    comTaskFilter.style.display = "block";
    pendingTodos.style.display = "none";
    completeTodos.style.display = "block";
    todoList.forEach(todo => {
        todo.offsetHeight >= 320 ? todo.classList.add('overflow') : todo.classList.remove('overflow');
    });
});


addInputField.addEventListener('keyup', () => {
    var inputVal = addInputField.value; //add task input field value//
    if (inputVal.trim()) { //checking after the trimming the whitespaces of input task whether the input task is null or not //
        addTaskBtn.classList.add('active'); //plus button will appear //
    } else {
        addTaskBtn.classList.remove('active');
    }
});


function showNotification(text, id) { //pop up //
    popup.textContent = text; //content inside pop up//
    popup.classList.add(`${id}`); //id is either success or danger , add class of id//
    setTimeout(() => {
        popup.textContent = "";
        popup.classList.remove(`${id}`); //removing class of id after 1.5s //
    }, 3000);
}


showtask(); //saving tasks into local storage//


addTaskBtn.onclick = () => {
    let userData = addInputField.value;
    let getLocalStorage = localStorage.getItem("Pending Tasks");
    if (getLocalStorage === null) {
        listArr = [];
    } else {
        listArr = JSON.parse(getLocalStorage);
    }
    listArr.push(userData); // pusing or adding userdata in listArr
    localStorage.setItem("Pending Tasks", JSON.stringify(listArr)); //setting the value of localstorage by converting listarr to json string//
    showtask();
    addTaskBtn.classList.remove("active");
    showNotification("Task is Added Successfully", "success");
}


// function for showing data to display from local storage
function showtask() {
    let getLocalStorage = localStorage.getItem("Pending Tasks");
    if (getLocalStorage === null) {
        listArr = [];
    } else {
        listArr = JSON.parse(getLocalStorage); // transforming json string into a js object
    }

    pendingNum.textContent = listArr.length;
    //Condition for functioning of ALLclear button if  mulitple tasks are there then all clear button is active else not.//
    if (listArr.length > 1) {
        deleteAllPenTodos.classList.add('active');
    } else {
        deleteAllPenTodos.classList.remove('active');
    }


    let newTodos = "";
    //for adding tasks in task blocks dynamically //
    listArr.forEach((element, index) => {
        newTodos += `<li>${element} <div class="action"><button onclick = "editTask(${index})"><i class="ri-file-edit-fill"></i></button><button onclick = "completeTask(${index})"><i class="ri-checkbox-fill"></i></button><button onclick = "deleteTask(${index})"><i class="ri-delete-bin-2-fill"></i></button></div></li>`
    });
    //editTask , completeTask and deleteTask are functions for manipulating the tasks which will be later defined//
    pending.innerHTML = newTodos; // adding new li tag inside ul tag.
    addInputField.value = "";

    todoList.forEach(todo => {
        todo.offsetHeight >= 320 ? todo.classList.add('overflow') : todo.classList.remove('overflow');
    });
}


// function for deleting todo...
function deleteTask(index) {
    if (confirm("Are you sure want to delete?")) { //confirmation for delete//
        let getLocalStorage = localStorage.getItem("Pending Tasks");
        let listArr = JSON.parse(getLocalStorage);
        listArr.splice(index, 1); // delete particular index element

        // after removing the li again update the local storage.
        localStorage.setItem("Pending Tasks", JSON.stringify(listArr));
        showtask();
        showNotification("Task is Removed Successfully", "danger");
    }
}


// function for deleting all tasks
deleteAllPenTodos.addEventListener('click', () => {
    if (confirm("Are you sure want to delete all pending task?")) {
        listArr = []; //removing every element//

        // after deleting all Pending tasks again updating the local storage with empty value
        localStorage.setItem("Pending Tasks", JSON.stringify(listArr));
        showtask();
        showNotification("Deleted All Pending Task Successfully", "danger");
    }
})




// function for editing tasks
function editTask(index) {
    editInputField.value = index;
    let getLocalStorage = localStorage.getItem("Pending Tasks");
    let listArr = JSON.parse(getLocalStorage);
    addInputField.value = listArr[index];
    addTaskBtn.style.display = "none"; //hidding the plus button
    saveTaskBtn.style.display = "block"; //revealing the save button
}


// save todo after editing...
saveTaskBtn.addEventListener('click', () => {
    let getLocalStorage = localStorage.getItem("Pending Tasks"); //retriveing 
    let listArr = JSON.parse(getLocalStorage);

    let val = editInputField.value;

    listArr[val] = addInputField.value; //updating the array with edited value

    addTaskBtn.style.display = "block";
    saveTaskBtn.style.display = "none";


    //updating the local storage
    localStorage.setItem("Pending Tasks", JSON.stringify(listArr));
    addInputField.value = "";
    addTaskBtn.classList.remove('active');
    showtask();
    showNotification("Task is Editted Successfully", "success");
})


showCompleteTask();


// completed task function...
function completeTask(index) {
    let getLocalStorage = localStorage.getItem("Pending Tasks");
    let listArr = JSON.parse(getLocalStorage);

    let comp = listArr.splice(index, 1); //return array with completed task 

    // after rmoving the li from Pending Tasks againg update the Pending Tasks.
    localStorage.setItem('Pending Tasks', JSON.stringify(listArr));
    showtask();

    comp.forEach(com => {
        comArr.push(com); // com is the value of completed task and comArr is the array for storing completed task
    });

    localStorage.setItem("Complete Tasks", JSON.stringify(comArr));
    showCompleteTask();
    showNotification("You have Completed a Task", "success");
}


function showCompleteTask() {
    let getLocalStorage = localStorage.getItem("Complete Tasks");
    if (getLocalStorage === null) {
        comArr = [];
    } else {
        comArr = JSON.parse(getLocalStorage);
    }
    completeNum.textContent = comArr.length;

    if (comArr.length > 1) {
        deleteAllComTodos.classList.add("active");
    } else {
        deleteAllComTodos.classList.remove("active");
    }


    let completeTask = "";

    comArr.forEach((element, index) => {
        completeTask += `<li>${element} <div class="action com"><button onclick = "back(${index})"><i class="fa-solid fa-xmark"></i></button><button onclick = "comDeleteTask(${index})"><i class="fa-solid fa-trash"></i></button></div></li>`
    });

    completeTasks.innerHTML = completeTask;
}



// delete completeTodo
function comDeleteTask(index) {
    if (confirm("Are you sure want to delete?")) {
        let getLocalStorage = localStorage.getItem("Complete Tasks");
        let comArr = JSON.parse(getLocalStorage);
        comArr.splice(index, 1);

        // after deleting li again update the local storage
        localStorage.setItem("Complete Tasks", JSON.stringify(comArr));
        showCompleteTask();
        showNotification("Deleted A Task from Completed Task", "danger");
    }
}


// delete all todos from completeTodos
deleteAllComTodos.addEventListener('click', () => {
    if (confirm("Are you sure want to delete all completed task?")) {
        comArr = [];

        // after deleting all task again update the local storage...
        localStorage.setItem("Complete Tasks", JSON.stringify(comArr));
        showCompleteTask();
        showNotification("Deleted All Tasks from Completed Task", "danger");
    }
});


// task transition from completed to pending block
function back(index) {
    let getLocalStorage = localStorage.getItem("Complete Tasks");
    let comArr = JSON.parse(getLocalStorage);
    let backTodo = comArr.splice(index, 1);

    // after deleting all task again update the local storage...
    localStorage.setItem("Complete Tasks", JSON.stringify(comArr));
    showCompleteTask();

    backTodo.forEach(back => {
        listArr.push(back);
    })

    localStorage.setItem("Pending Tasks", JSON.stringify(listArr));
    showtask();
}



// filtering tasks
function filterPenTask() {
    let filterInput = document.querySelector('#penTaskFilter').value.toLowerCase();
    let li = pending.querySelectorAll('li');

    li.forEach(task => {
        if (task) { //checking if task is there
            let textValue = task.textContent;
            if (textValue.toLowerCase().indexOf(filterInput) != -1) { //checking if filter input is a substring of expected task or not
                task.style.display = ""; //restoring the display of the list element to its default behaviour 
            } else {
                task.style.display = "none";
            }
        }
    })
}


function filterCompleteTask() {
    let filterInput = document.querySelector('#comTaskFilter').value.toLowerCase();
    let li = completeTasks.querySelectorAll('li');

    li.forEach(task => {
        if (task) {
            let textValue = todo.textContent;
            if (textValue.toLowerCase().indexOf(filterInput) != -1) {
                task.style.display = "";
            } else {
                task.style.display = "none";
            }
        }
    });
}