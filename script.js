class Board {
  constructor(id, title, tasks) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;
  }

  getView() {
    const boardContainer = document.createElement("div");
    boardContainer.classList.add("board");
    boardContainer.dataset.boardId = this.id;

    const htmlRow = document.createElement("div");
    htmlRow.classList.add("row");

    const duplicateButton = document.createElement("button");
    duplicateButton.classList.add("duplicate-button");
    duplicateButton.textContent = "Duplicate board";
    duplicateButton.addEventListener("click", () => this.duplicateBoard());
    htmlRow.appendChild(duplicateButton);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", () => this.deleteBoard());
    htmlRow.appendChild(deleteButton);

    boardContainer.appendChild(htmlRow);

    const boardTitle = document.createElement("p");
    boardTitle.classList.add("board-title");
    boardTitle.textContent = this.title;
    boardTitle.addEventListener("click", () => this.boardTitleClick());
    boardContainer.appendChild(boardTitle);

    const tasksContainer = document.createElement("ul");
    tasksContainer.classList.add("tasks");
    boardContainer.appendChild(tasksContainer);

    this.tasks.forEach((task) => {
      const taskContainer = this.getTaskView(task);
      tasksContainer.appendChild(taskContainer);
    });

    const newTaskInput = document.createElement("input");
    newTaskInput.dataset.boardId = this.id;
    newTaskInput.classList.add("new-task-input");
    newTaskInput.type = "text";
    newTaskInput.placeholder = "Nova tarefa";
    newTaskInput.addEventListener("keypress", (e) => {
      this.handleNewTaskInputKeypress(e);
    });
    boardContainer.appendChild(newTaskInput);

    return boardContainer;
  }

  duplicateBoard() {
    const boardsContainer = document.querySelector(".boards");
    const lastBoardId = toDo.boards[toDo.boards.length - 1].id;
    const newBoard = new Board(
      lastBoardId + 1,
      `${this.title} Copy`,
      this.tasks
    );

    const boardContainer = newBoard.getView();
    boardsContainer.appendChild(boardContainer);
    toDo.boards.push(newBoard);
  }

  deleteBoard() {
    toDo.boards = toDo.boards.filter((board) => board.id !== this.id);

    const boardContainer = document.querySelector(
      `[data-board-id="${this.id}"]`
    );
    boardContainer.remove();
  }

  boardTitleClick() {
    const newTitle = prompt("Novo titulo do board");
    if (!newTitle) {
      alert("Insira o novo título!");
      return;
    }

    const boardTitleElement = document.querySelector(
      `.board-${this.id} .board-title`
    );
    boardTitleElement.textContent = newTitle;
  }

  getTaskView(task) {
    const taskContainer = document.createElement("li");
    taskContainer.classList.add("task");
    taskContainer.dataset.taskId = task.id;
    taskContainer.dataset.boardId = this.id;
    if (task.completed) {
      taskContainer.classList.add("completed");
    }

    const taskCheckbox = document.createElement("input");
    taskCheckbox.id = `checkbox-${task.id}-${Date.now()}`;
    taskCheckbox.classList.add("checkbox");
    taskCheckbox.type = "checkbox";
    taskCheckbox.checked = task.completed;
    taskCheckbox.addEventListener("click", () => this.completeTask(task.id));
    taskContainer.appendChild(taskCheckbox);

    const taskName = document.createElement("label");
    taskName.classList.add("task-name");
    taskName.textContent = task.name;
    taskName.htmlFor = taskCheckbox.id;
    taskContainer.appendChild(taskName);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", () => this.deleteTask(task.id));
    taskContainer.appendChild(deleteButton);

    return taskContainer;
  }

  addTask(name) {
    const taskId = this.tasks.length;
    this.tasks.push(new Task(taskId + 1, name, false));
    const tasksContainer = document.querySelector(
      `[data-board-id="${this.id}"] .tasks`
    );
    const taskContainer = this.getTaskView(this.tasks[taskId]);
    tasksContainer.appendChild(taskContainer);
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);

    const taskContainer = document.querySelector(
      `[data-task-id="${taskId}"][data-board-id="${this.id}"]`
    );
    taskContainer.remove();
  }

  completeTask(taskId) {
    const completedTask = this.tasks.find((task) => task.id === taskId);
    completedTask.completed = !completedTask.completed;

    const taskContainer = document.querySelector(
      `[data-task-id="${taskId}"][data-board-id="${this.id}"]`
    );
    taskContainer.classList.toggle("completed");
  }

  handleNewTaskInputKeypress(e) {
    if (e.key === "Enter") {
      this.addTask(e.target.value);
      e.target.value = "";
    }
  }
}

class Task {
  constructor(id, name, completed) {
    this.id = id;
    this.name = name;
    this.completed = completed;
  }
}

class UI {
  constructor(boards) {
    this.boards = boards;
  }

  addBoard(newBoardTitle) {
    const lastBoardId = toDo.boards[toDo.boards.length - 1]?.id || 0;

    const board = new Board(lastBoardId + 1, newBoardTitle, []);
    toDo.boards.push(board);

    const boardsContainer = document.querySelector(".boards");
    const boardContainer = board.getView();
    boardsContainer.appendChild(boardContainer);
  }

  handleNewBoardInputKeypress(e) {
    if (e.key === "Enter") {
      this.addBoard(e.target.value);
      e.target.value = "";
    }
  }

  renderizarBoards() {
    const boardsContainer = document.querySelector(".boards");

    this.boards.forEach((board) => {
      const boardContainer = board.getView();

      boardsContainer.appendChild(boardContainer);
    });
  }
}
const boardPessoal = new Board(1, "Meu Board", [
  new Task(1, "tarefa 1", false),
  new Task(2, "tarefa 2", false),
  new Task(3, "tarefa 3", true),
  new Task(4, "tarefa 4", false),
  new Task(5, "tarefa 5", true),
]);

const toDo = new UI([boardPessoal]);

toDo.renderizarBoards();

const newBoardInput = document.querySelector(".new-board-input");
newBoardInput.addEventListener("keypress", (e) =>
  toDo.handleNewBoardInputKeypress(e)
);
