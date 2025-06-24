
    // Create animated background particles
    function createParticles() {
      const bgAnimation = document.getElementById('bgAnimation');
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        bgAnimation.appendChild(particle);
      }
    }

    // Status notification system
    function showStatus(message, type = 'success') {
      const existing = document.querySelector('.status-indicator');
      if (existing) existing.remove();

      const indicator = document.createElement('div');
      indicator.className = `status-indicator ${type}`;
      
      let icon = '';
      switch(type) {
        case 'success': icon = '<i class="fas fa-check-circle"></i>'; break;
        case 'error': icon = '<i class="fas fa-exclamation-circle"></i>'; break;
        case 'info': icon = '<i class="fas fa-info-circle"></i>'; break;
      }
      
      indicator.innerHTML = `${icon} ${message}`;
      document.body.appendChild(indicator);

      setTimeout(() => indicator.classList.add('show'), 100);
      setTimeout(() => {
        indicator.classList.remove('show');
        setTimeout(() => indicator.remove(), 300);
      }, 3000);
    }
    
    // Connection status monitoring
    function monitorConnection() {
      const connectionStatus = document.getElementById('connectionStatus');
      
      function updateStatus() {
        if (navigator.onLine) {
          connectionStatus.className = 'connection-status connected';
          connectionStatus.innerHTML = '<i class="fas fa-wifi"></i> <span>Connected</span>';
        } else {
          connectionStatus.className = 'connection-status disconnected';
          connectionStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>Offline</span>';
        }
      }
      
      window.addEventListener('online', updateStatus);
      window.addEventListener('offline', updateStatus);
      updateStatus();
    }
    
    // Form validation
    function validateForm() {
      const title = document.getElementById('note-title').value.trim();
      const content = document.getElementById('note-content').value.trim();
      let isValid = true;
      
      // Reset error states
      document.getElementById('title-error').style.display = 'none';
      document.getElementById('content-error').style.display = 'none';
      document.getElementById('note-title').classList.remove('error');
      document.getElementById('note-content').classList.remove('error');
      
      // Validate title
      if (!title) {
        document.getElementById('title-error').style.display = 'block';
        document.getElementById('note-title').classList.add('error');
        isValid = false;
      }
      
      // Validate content
      if (!content) {
        document.getElementById('content-error').style.display = 'block';
        document.getElementById('note-content').classList.add('error');
        isValid = false;
      }
      
      return isValid;
    }
    
    // Update empty state visibility
   function updateEmptyState() {
  const notesContainer = document.getElementById('notes-container');
  const emptyState = document.getElementById('emptyState');
  
  // Check if any notes exist in the container
  const hasNotes = notesContainer.querySelector('.note') !== null;
  
  // Show empty state only if no notes exist
  if (!hasNotes) {
    emptyState.style.display = 'flex';
  } else {
    emptyState.style.display = 'none';
  }
}
    
    let FocusedNote = null;
    let FocusedNoteId = null;
    const saveBtn = document.getElementById("saveBtn");
    document.getElementById("addNewNote").classList.add("hide");

    function resetForm() {
      document.getElementById("addNewNote").classList.add("hide");
      document.getElementById('note-title').value = '';
      document.getElementById('note-content').value = '';
      saveBtn.innerText = "Save Note";
      saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Note';
      document.querySelectorAll('.note').forEach(n => n.classList.remove('focused'));
      FocusedNote = null;
      FocusedNoteId = null;
      
      // Clear validation errors
      document.getElementById('title-error').style.display = 'none';
      document.getElementById('content-error').style.display = 'none';
      document.getElementById('note-title').classList.remove('error');
      document.getElementById('note-content').classList.remove('error');
    }

    async function takeAction() {
      if (!validateForm()) {
        return;
      }
      
      const title = document.getElementById('note-title').value.trim();
      const content = document.getElementById('note-content').value.trim();

      const data = JSON.stringify({ notes_topic: title, notes_text: content });
      saveBtn.classList.add('loading');

      if (FocusedNoteId === null) {
        updateEmptyState();
        // CREATE new note
        try {
          const response = await fetch('http://127.0.0.1:8000/addNote', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: data
          });

          const result = await response.json();

          if (result.status === "success") {
            const newId = result.id;
            const noteDiv = createNoteElement(newId, title);
            document.getElementById('notes-container').prepend(noteDiv);

            FocusedNote = noteDiv;
            FocusedNoteId = newId;
            resetForm();
            showStatus('Note created successfully! ✨');
            updateEmptyState();
          } else {
            showStatus('Failed to create note', 'error');
          }
        } catch (error) {
          showStatus('Connection error occurred', 'error');
        }
      } else {
        document.getElementById("addNewNote").classList.remove("hide");
        try {
          const response = await fetch(`http://127.0.0.1:8000/updateNote/${FocusedNoteId}`, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
            },
            body: data
          });

          const result = await response.json();
          if (FocusedNote) {
            const h3 = FocusedNote.querySelector('h3');
            if (h3) h3.innerText = title;
          }
          showStatus('Note updated successfully! 🎉');
        } catch (error) {
          showStatus('Failed to update note', 'error');
        }
      }
      saveBtn.classList.remove('loading');
    }

    function createNoteElement(id, title) {
      const noteDiv = document.createElement('div');
      noteDiv.className = 'note';
      noteDiv.setAttribute('data-id', id);

      noteDiv.innerHTML = `
        <h3>${title}</h3>
        <div class="note-actions">
          <button class="delete" onclick="event.stopPropagation(); deleteNote(this)"><i class="fas fa-trash-alt"></i></button>
        </div>
      `;

      noteDiv.addEventListener('click', function () {
        onNoteClick(noteDiv);
      });

      noteDiv.addEventListener('dblclick', function () {
        enableInlineEdit(noteDiv);
      });

      return noteDiv;
    }

    function onNoteClick(noteElement) {
      document.querySelectorAll('.note').forEach(n => n.classList.remove('focused'));
      document.getElementById("addNewNote").classList.remove("hide");
      saveBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Update Note';

      noteElement.classList.add('focused');

      FocusedNote = noteElement;
      FocusedNoteId = noteElement.dataset.id;

      fetch(`http://127.0.0.1:8000/notes/${FocusedNoteId}`)
        .then(res => res.json())
        .then(data => {
          document.getElementById('note-title').value = data.result[1];
          document.getElementById('note-content').value = data.result[2];
        })
        .catch(err => {
          showStatus('Failed to load note content', 'error');
        });
    }

    async function deleteNote(button) {
      const note = button.closest('.note');
      const noteId = note.dataset.id;
      
      try {
        const response = await fetch(`http://127.0.0.1:8000/deleteNote/${noteId}`, {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const result = await response.json();
        if (result.status === "success") {
          updateEmptyState(); 
          note.style.transform = 'translateX(-100%)';
          note.style.opacity = '0';
          setTimeout(() => {
            note.remove();
            updateEmptyState();
          }, 300);
          
          if (FocusedNoteId === noteId) {
            resetForm();
          }
          showStatus('Note deleted successfully! 🗑️');
        }
      } catch (error) {
        showStatus('Failed to delete note', 'error');
      }
    }

    function enableInlineEdit(noteElement) {
      // Prevent editing unfocused notes
      if (FocusedNoteId !== noteElement.dataset.id) {
        showStatus('Focus the note first to edit', 'error');
        return;
      }
      
      const titleEl = noteElement.querySelector('h3');
      const input = document.createElement('input');
      input.type = 'text';
      input.value = titleEl.innerText;

      input.onblur = async () => {
        const newTitle = input.value.trim();
        if (newTitle && newTitle !== titleEl.innerText) {
          titleEl.innerText = newTitle;
          const noteId = noteElement.dataset.id;
          document.getElementById('note-title').value = newTitle;

          const content = document.getElementById('note-content').value;
          try {
            await fetch(`http://127.0.0.1:8000/updateNote/${noteId}`, {
              method: "PUT",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                notes_topic: newTitle,
                notes_text: content
              })
            });
            showStatus('Title updated! ✏️');
          } catch (error) {
            showStatus('Failed to update title', 'error');
          }
        }

        titleEl.style.display = 'block';
        input.remove();
      };

      titleEl.style.display = 'none';
      noteElement.insertBefore(input, titleEl);
      input.focus();
    }

    window.addEventListener("DOMContentLoaded", () => {
      createParticles();
      monitorConnection();
      fetchAllNotes();
      updateEmptyState();
    });

    async function fetchAllNotes() {
      try {
        const res = await fetch("http://127.0.0.1:8000/getAllNotes");
        const data = await res.json();

        if (data.status === "success" && Array.isArray(data.data)) {
          // Clear empty state if notes exist
          updateEmptyState();
          
          data.data.forEach(note => {
            const noteDiv = createNoteElement(note[0], note[1]);
            document.getElementById('notes-container').appendChild(noteDiv);
          });
        } else {
          console.warn("No notes found or unexpected response structure.");
        }
      } catch (error) {
        console.error("Error loading notes:", error);
        showStatus('Failed to load notes', 'error');
      }
      updateEmptyState();
    }