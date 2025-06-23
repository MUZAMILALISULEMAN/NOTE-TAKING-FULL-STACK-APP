
 let noteIdCounter = 1; 

    function createNote() {
      const title = document.getElementById('note-title').value;
      const content = document.getElementById('note-content').value;

      if (!title || !content) return alert('Title and content required.');

      const noteId = noteIdCounter++;

      const noteHTML = `
        <div class="note" data-id="${noteId}" onclick="loadNoteContent(${noteId})">
          <h3>${title}</h3>
          <div class="note-actions">
            <button onclick="event.stopPropagation(); editNote(this)">✏️</button>
            <button class="delete" onclick="event.stopPropagation(); deleteNote(this)">🗑️</button>
          </div>
        </div>`;

      document.getElementById('notes-container').innerHTML += noteHTML;

      document.getElementById('note-title').value = '';
      document.getElementById('note-content').value = '';
    }

    function deleteNote(button) {
      button.closest('.note').remove();
    }

    function editNote(button) {
      const note = button.closest('.note');
      const titleEl = note.querySelector('h3');

      const input = document.createElement('input');
      input.type = 'text';
      input.value = titleEl.innerText;
      input.onblur = () => {
        if (input.value.trim() !== '') {
          titleEl.innerText = input.value;
          titleEl.style.display = 'block';
          input.remove();
        }
      };

      titleEl.style.display = 'none';
      note.insertBefore(input, titleEl);
      input.focus();
    }

    function loadNoteContent(noteId) {
      
    }
