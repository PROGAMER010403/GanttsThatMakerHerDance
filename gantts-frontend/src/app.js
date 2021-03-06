class App {

  static click() {
    document.addEventListener('click', (e) => {

      switch (e.target.className) { // refactor with the taskElement creator from tasks adapter

//create task box
        case "track ui-sortable":
          let newTask = document.createElement('LI')
          newTask.className = "task"
          // makeResizable()
          newTask.innerHTML = `
          <a class="create-task button" id="create-new-task" href="#">New Task!</a><br/>
          <a class"delete-blank-task" id="or-not" href="#">Or Not.</a>
          `
          e.target.append(newTask)
          break

//create task form
        case "create-task button":
          let task = ''
          let newForm = TaskForm.newForm(task)
          e.target.parentElement.innerHTML = `
          <input id="task-title" placeholder="Task Title"><br/>
          <a class="create-task" href="#">Create Task</a>`
          document.getElementById('or-not').remove()
          e.target.remove()

          break

//task box with title
        case "create-task":
          let taskTitle = document.getElementById('task-title').value
          let taskContent = ""
          let parent = e.target.parentElement

          let xLocation = e.target.parentElement.getBoundingClientRect()
          let startTime = xLocation.left
          let duration = 100

          let parentTrackId = elementIdNumber(e.target.parentElement.parentElement.parentElement)
          TasksAdapter.create(taskTitle, taskContent, startTime, duration, parentTrackId)

          parent.remove()
          // parent.innerHTML = `
          // ${taskTitle}
          // <br/><button class="edit button" id="${taskTitle}">+</button>
          // <button class="delete button" id="${taskTitle}">-</button>`
          // parent.style.width = `${duration}px`
          // makeResizable()
          break


  // add a new track
        case "new-track-button":
          let allTracks = document.querySelectorAll("ul")
          let highestPriority = 0
          for (let track of allTracks) {
            let trackId = elementIdNumber(track)
            let currentTrack = Track.find(trackId)
            if (currentTrack.priority > highestPriority) {
              highestPriority = currentTrack.priority
            }
          }

          highestPriority++

          let projectName = document.querySelector(".project-name")
          let projectId = elementIdNumber(projectName) // 'project-1'

          let newTrack = TracksAdapter.create(projectId, highestPriority)
          break

  // delete existing track

        case "delete-track-button":
          // identify the track
          let track = Track.find(elementIdNumber(e.target))
          let trackElement = document.getElementById(`track-container-${track.id}`)
          for (let task of track.tasks) {
            TasksAdapter.delete(task)
          }
          TracksAdapter.delete(track)

          trackElement.innerHTML = ''
          trackElement.remove()
          break

  // start timer bar

        case "start-gantt":
          $(':button').prop('disabled', true);

          let trackIds = Track.all.map(x => x.id);
          let taskArrays = trackIds.map(x => Task.findByTrack(x));
          let lengths = taskArrays.map(function(a){return a.length;});
          let maxLength = Math.max(...lengths);

          //animation and overall timer
          let tasks = $(".track").children();
          let rightmost = App.farRightDiv(tasks);
          let leftmost = $(tasks[0]).offset().left;
          App.progressBar(leftmost,rightmost,maxLength);


          //display variables
          let secondsPerTask = 5; //change this back to 300 for full 5 minutes
          let currentIndex = 0;

          App.insertDisplayDivs(trackIds);

          let totalSeconds = secondsPerTask;


          let timerInterval = setInterval(function(){
            let formattedSeconds = formattedTime(totalSeconds);
            document.getElementById("currentTimer").innerText=formattedSeconds;
            if (totalSeconds > 1){
              totalSeconds--;
            } else {
              totalSeconds = secondsPerTask
            }
          },1000);//end timerInterval



          let changeDisplay = setInterval(function(){

            for (let index in taskArrays){
              let intIndex = parseInt(index)
              if (taskArrays[intIndex][currentIndex]) {
                document.querySelector(`#currentTrack${intIndex+1}`).innerHTML =
                  taskArrays[intIndex][currentIndex].taskDiv();
              } else {
                document.querySelector(`#currentTrack${intIndex+1}`).innerHTML =
                "";
              }
              if (taskArrays[intIndex][currentIndex+1]) {
                document.querySelector(`#nextTrack${intIndex+1}`).innerHTML =
                  taskArrays[intIndex][currentIndex+1].taskDiv();
              } else {
                document.querySelector(`#nextTrack${intIndex+1}`).innerHTML =
                "";
              }
            };

            if (currentIndex < maxLength-1){
                  currentIndex++;
                } else {
                  document.getElementById("currentTimer").innerText="";
                  clearInterval(timerInterval)

                  clearInterval(changeDisplay)}
                },5000);//end changeDisplay



          // })
          //
          //
          // for (let i=0; i < maxLength-1; i++) {
          //   let changeDisplay = setInterval(function(){
          //     for (let index in taskArrays){
          //       let intIndex = parseInt(index)
          //       if (taskArrays[intIndex][i]) {
          //         document.querySelector(`#currentTrack${intIndex+1}`).innerHTML =
          //           taskArrays[intIndex][i].taskDiv();
          //       } else {
          //         document.querySelector(`#currentTrack${intIndex+1}`).innerHTML =
          //         "";
          //       }
          //       if (taskArrays[intIndex][i+1]) {
          //         document.querySelector(`#nextTrack${intIndex+1}`).innerHTML =
          //           taskArrays[intIndex][i+1].taskDiv();
          //       } else {
          //         document.querySelector(`#nextTrack${intIndex+1}`).innerHTML =
          //         "";
          //       }
          //
          //     };
          //   }, 3000)
          //
          //   let myInterval = setInterval(function(){
          //     let formattedSeconds = formattedTime(totalSeconds); //5 minutes
          //     document.getElementById("currentTimer").innerText=formattedSeconds; // should move this somewhere, but where
          //     if (totalSeconds > 0){
          //       totalSeconds--;
          //     } else {
          //       document.getElementById("currentTimer").innerText="" // move this somewhere, too
          //       $("#myBar").width("0px");
          //       $("#timeline").animate({left: 0}, 0, "linear");
          //       $(':button').prop('disabled', false);
          //       clearInterval(myInterval)}
          //     }
          //     ,1000);
          //   }; // end of crazy for loop
          //

          break

//edit, delete & update task buttons

        case "delete button":
          let delTask = Task.findByTitle(e.target.id)
          TasksAdapter.delete(delTask)
          $(e.target).closest("li").remove()
          break

        case "edit button":
          let ediTask = Task.findByTitle(e.target.id)

          e.target.parentElement.innerHTML = `
          <br/><input id="task-title" name="${ediTask.id}" value="${ediTask.title}">
          <a class="update-task" href="#">Update</a>
          `
          break

          case "update-task":
            let upTask = Task.findById(parseInt(e.target.parentElement.children[1].name))
            upTask.title = document.getElementById('task-title').value

            TasksAdapter.update(upTask)

            e.target.parentElement.innerHTML = `
            ${upTask.title}
            <br/><button class="edit button" id="${upTask.title}">+</button>
            <button class="delete button" id="${upTask.title}">-</button>
                    `
            // e.target.parentElement.parentElement.remove()

            break


        default:
          console.log(e)
        }
    })//CLICK-EVENTLISTENER
  }//CLICK FUCNTION

  static farRightDiv(tasks){
    let rightmost = 0
    for (let task of tasks) {
      let rightSide = $(task).offset().left + $(task).outerWidth();
      if (rightSide > rightmost){
        rightmost = rightSide;
      }
    }
    return rightmost
  };

  static insertDisplayDivs(trackIds){
    trackIds.forEach(x => {document.querySelector(".d").innerHTML +=
      `<div id="currentTrack${x}" class="inline"></div>`
      document.querySelector(".e").innerHTML +=
      `<div id="nextTrack${x}" class="inline"></div>`
    });
  }

  static progressBar(startLength, endLength, tasksLength) {
    let totalSeconds = tasksLength*5; //add *60 back when done
    let totalMilliseconds = totalSeconds*1000;
    let barLength = endLength-startLength;
    $("#myProgress").width(barLength);
    $("#myBar").animate({width: barLength}, totalMilliseconds, "linear");
    $("#timeline").animate({left: barLength}, totalMilliseconds, "linear");
    let myInterval = setInterval(function(){
      let formattedSeconds = formattedTime(totalSeconds);
      document.getElementById("timer").innerText=formattedSeconds; // should move this somewhere, but where
      if (totalSeconds > 0){
        totalSeconds--;
      } else {
        document.getElementById("timer").innerText="" // move this somewhere, too
        $("#myBar").width("0px");
        $("#timeline").animate({left: 0}, 0, "linear");
          $("#myProgress").width("0px");
        $(':button').prop('disabled', false);
        clearInterval(myInterval)}
      }
      ,1000);
    };
}; //END OF APP CLASS


//formats time in seconds to min:seconds
function formattedTime(time) {
  let mins = 0;
  let seconds = 0;
  mins = Math.floor(time/60)
  seconds = time%60
  if (String(mins).length<2) mins="0"+String(mins)
  if (String(seconds).length<2) seconds="0"+String(seconds)
  return `${mins}:${seconds}`
};
