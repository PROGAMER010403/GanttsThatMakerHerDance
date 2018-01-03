class TasksAdapter {

  // static all(){
  //   fetch('http://localhost:3000/api/tasks')
  //   .then(resp => resp.json())
  //   .then(json => populateTasks(json))
  // }

  static create(title, content, startTime, duration, trackId){
    const params = {
          "method": "POST",
          "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          "body": JSON.stringify({title: title, content: content, start_time: startTime, duration: duration, track_id: trackId})
        }
      return fetch('http://localhost:3000/api/tasks', params)
        .then(resp => resp.json())
        .then(json => createTaskObj(json))
      }

  static update(task){
    const params = {
          "method": "PATCH",
          "headers": {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          "body": JSON.stringify({title: task.title, content: task.content, start_time: task.start_time, duration: task.duration})
        }
      return fetch(`http://localhost:3000/api/tasks/${task.id}`, params)
        .then(resp => resp.json())
        .then(json => updateTaskObj(json))
      }

    static delete(task){
      const params = {
            "method": "DELETE",
            "headers": {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        return fetch(`http://localhost:3000/api/tasks/${task.id}`, params)
        }

}



//HELPER METHODS

function populateTasks(json){
  json.forEach((hash)=>{
    let newTask = new Task(hash)
    let trackId = newTask.track_id
    let parentTrack = document.getElementById(`track-${trackId}`)
    createTaskElement(parentTrack, newTask)
  })
}

function createTaskElement(trackElement, task) {

  let newTask = document.createElement('div')
  newTask.className = "task"
  newTask.id = `${task.id}`
  newTask.innerHTML = task.title
  trackElement.append(newTask)
}


function createTaskObj(json){
  let newTask = new Task(json)
}

function updateTaskObj(json){
  let t = Task.findById(json.id)
  t.title = json.title
  t.content = json.content
  t.start_time = json.start_time
  t.duration = json.duration
}
