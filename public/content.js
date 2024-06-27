const head = document.head || document.getElementsByTagName('head')[0];
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';
head.appendChild(link);

const tasksData = {
    "tasks": [
        {
            "title": "[Bài đọc] Hướng dẫn cài đặt môi trường"
        },
        {
            "title": "[Bài đọc] Hướng dẫn cài đặt môi trường"
        },
        {
            "title": "[Bài đọc] Hướng dẫn cài đặt môi trường"
        },
        {
            "title": "[Bài đọc] Hướng dẫn cài đặt môi trường"
        },
        {
            "title": "[Bài đọc] Hướng dẫn cài đặt môi trường"
        }
    ]
};

const tasks = tasksData.tasks;

const fabButton = document.createElement('button');
fabButton.innerHTML = '<i class="material-icons">apps</i>';
fabButton.classList.add('btn', 'btn-primary', 'btn-floating', 'position-fixed', 'm-4');
fabButton.setAttribute('style', 'right: 0;bottom: 155px;z-index: 9999');
fabButton.addEventListener('click', () => {
    panel.classList.toggle('d-none');
});
document.body.appendChild(fabButton);

const panel = document.createElement('div');
panel.classList.add('card', 'fixed-top', 'p-4', 'w-25', 'bg-light', 'border', 'border-primary', 'd-none');
panel.setAttribute('style', 'left: auto;z-index: 9998;');
panel.id = 'panel';

const tokenInput = document.createElement('input');
tokenInput.classList.add('form-control', 'form-control-sm', 'mb-3');
tokenInput.setAttribute('type', 'text');
tokenInput.setAttribute('id', 'token');
tokenInput.setAttribute('placeholder', 'Nhập token');
const savedToken = localStorage.getItem('token');
if (savedToken) {
    const cleanToken = savedToken.replace(/"/g, '');
    tokenInput.value = cleanToken;
}

panel.appendChild(tokenInput);

const swimlaneIdInput = document.createElement('input');
swimlaneIdInput.classList.add('form-control', 'form-control-sm', 'mb-3');
swimlaneIdInput.setAttribute('type', 'text');
swimlaneIdInput.setAttribute('id', 'swimlane_id');
swimlaneIdInput.setAttribute('placeholder', 'Nhập swimlane_id');
panel.appendChild(swimlaneIdInput);

const columnIdInput = document.createElement('input');
columnIdInput.classList.add('form-control', 'form-control-sm', 'mb-3');
columnIdInput.setAttribute('type', 'text');
columnIdInput.setAttribute('id', 'column_id');
columnIdInput.setAttribute('placeholder', 'Nhập column_id');
panel.appendChild(columnIdInput);

const boardIdInput = document.createElement('input');
boardIdInput.classList.add('form-control', 'form-control-sm', 'mb-3');
boardIdInput.setAttribute('type', 'text');
boardIdInput.setAttribute('id', 'board_id');
boardIdInput.setAttribute('placeholder', 'Nhập board_id');
panel.appendChild(boardIdInput);

tasks.forEach(task => {
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'list-group-flush');

    const titleElement = document.createElement('li');
    titleElement.classList.add('list-group-item');
    titleElement.textContent = task.title;
    ul.appendChild(titleElement);

    const addButton = document.createElement('button');
    addButton.textContent = 'Thêm';
    addButton.classList.add('btn', 'btn-sm', 'btn-primary', 'mr-2');
    addButton.addEventListener('click', () => {
        const token = document.getElementById('token').value;
        const swimlaneId = document.getElementById('swimlane_id').value;
        const columnId = document.getElementById('column_id').value;
        const boardId = document.getElementById('board_id').value;

        if (!token || !swimlaneId || !columnId || !boardId) {
            alert('Vui lòng nhập đầy đủ token, swimlane_id, column_id và board_id.');
            return;
        }

        fetch(`https://ken-backend.codegym.vn/boards/${boardId}/tasks`, {
            method: "POST",
            body: JSON.stringify({
                "title": task.title,
                "description": "",
                "time_estimated": 30,
                "color": "f2d600",
                "swimlane_id": swimlaneId,
                "column_id": columnId,
                "position": 0,
                "board_id": boardId,
                "time_estimated_type": "minutes"
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": token
            }
        });
        alert(`Đã thêm công việc: ${task.title}, token: ${token}, swimlane_id: ${swimlaneId}, column_id: ${columnId}, board_id: ${boardId}`);
    });
    titleElement.appendChild(addButton);

    panel.appendChild(ul);
});

const addAllButton = document.createElement('button');
addAllButton.textContent = 'Thêm tất cả';
addAllButton.classList.add('btn', 'btn-sm', 'btn-success', 'mb-3');
addAllButton.addEventListener('click', () => {
    alert('Comming soon!');
});
panel.appendChild(addAllButton)

document.body.appendChild(panel);
