class App {

  static click() {
    document.addEventListener('click', (e) => {

      switch (e.target.className) { // refactor with the taskElement creator from tasks adapter

//create task box
        case "track ui-sortable":
          let createTaskBtn = document.createElement('BUTTON')
          createTaskBtn.className = "create-task button"
          createTaskBtn.innerHTML = "Create Task!"

          let newTask = document.createElement('LI')
          newTask.className = "task"

          let delButton = document.createElement('BUTTON')
          delButton.innerHTML = "Or Not."
          delButton.className = "delete-blank-task button"

          newTask.append(createTaskBtn, delButton)
          e.target.append(newTask)
          break

//create task form
        case "create-task-button":
          let task = ''
          let newForm = TaskForm.newForm(task)
          e.target.parentElement.append(newForm)
          e.target.remove()
          break

//task box with title
        case "create-task":
          let taskTitle = document.getElementById('task-title').value
          let taskContent = document.getElementById('task-content').value
          let parent = e.target.parentElement.parentElement
          parent.id = "made-task"

          let xLocation = e.target.parentElement.getBoundingClientRect()
          let startTime = xLocation.left
          let duration = 20


          let parentTrackId = elementIdNumber(e.target.parentElement.parentElement.parentElement)
          TasksAdapter.create(taskTitle, taskContent, startTime, duration, parentTrackId)

          parent.innerHTML = `
          ${taskTitle}
          <br/><button class="edit button" id="${taskTitle}">+</button>
          <button class="delete button" id="${taskTitle}">-</button> `
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
          debugger
          // TracksAdapter.delete(track)
          break

  // start timer bar

        case "start-gantt":
          // document.querySelector('t')
          $(':button').prop('disabled', true);

          //animation and overall timer
          let tasks = $(".track").children();
          let rightmost = 0;
          let leftmost = $(tasks[0]).offset().left;

          for (let task of tasks) {
            let rightSide = $(task).offset().left + $(task).outerWidth();
            if (rightSide > rightmost){
              rightmost = rightSide;
            }
            // let tasksEndpoint = $(tasks[tasks.length-1]).offset().right
          }
          App.progressBar(leftmost,rightmost,tasks.length)

          let tracks = Track.all.map(x => x.id)

          Task.findByTrack

          break

//edit, delete & update task buttons

        case "delete button":
          let delTask = Task.findByTitle(e.target.id)
          TasksAdapter.delete(delTask)
          e.target.parentElement.remove()
          break

        case "edit button":
          let ediTask = Task.findByTitle(e.target.id)
          let newF = TaskForm.newForm(ediTask)
          e.target.parentElement.append(newF)
          break

        // case "update-task":
        // debugger
        //   let upTask = Task.findByTitle(e.target.parentElement.parentElement.innerHTML.split('<')[0])
        //   console.log(upTask);
        //   break

        
        default:
          console.log(e)
        }
    })//CLICK-EVENTLISTENER
  }//CLICK FUCNTION



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
