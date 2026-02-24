// Encryption key (same on client and server)
const ENCRYPTION_KEY = "when-messages-waited-2024-secret-key";

// Navigation
function nextScreen(screenNumber) {
  const currentScreen = document.querySelector('.screen.active');
  const nextScreenEl = document.getElementById(`screen${screenNumber}`);
  
  if (!nextScreenEl || !currentScreen) return;
  
  currentScreen.classList.remove('active');
  
  setTimeout(() => {
    nextScreenEl.classList.add('active');
    
    // reset animations for reveal elements
    const reveals = nextScreenEl.querySelectorAll('.reveal');
    reveals.forEach(el => {
      el.style.animation = 'none';
      setTimeout(() => {
        el.style.animation = '';
      }, 10);
    });

    // if returning to the letter screen, reset any sending animation
    if (screenNumber === 5) {
      const mailContainer = document.getElementById('mailContainer');
          if (mailContainer) {
            // trigger envelope animation
            mailContainer.classList.add('sent'); // does not work :( could not fix
          }
    }
  }, 600);
}

// Screen 3 Q/A. Purpose: user engagement
function answerQuestion() {
  document.querySelectorAll('.choice-btn').forEach(btn => btn.style.display = 'none');
  const response = document.getElementById('answerResponse');
  if (response) {
    response.classList.add('show');
  }
}

// slider label logic
function updateSliderLabel(value) {
  const label = document.getElementById('sliderLabel');
  if (!label) return;

  const v = Number(value);
  if (v <= 25) {
    label.textContent = "I hate uncertainty. This may feel uncomfortable. That's okay.";
  } else if (v <= 75) {
    label.textContent = "Somewhere in the middle. You'll feel this a bit.";
  } else {
    label.textContent = "You claim to surrender easily. Let's see how it feels.";
  }
}

// Screen 5. Live preview of names + form & oath wiring
document.addEventListener('DOMContentLoaded', () => {
  const fromInput = document.getElementById('fromName');
  const toInput = document.getElementById('toName');
  const previewFrom = document.getElementById('previewFromName');
  const previewTo = document.getElementById('previewToName');
  const oathCheckbox = document.getElementById('oathCheckbox');
  const readyBtn = document.getElementById('readyBtn');
  const uncertaintySlider = document.getElementById('uncertaintySlider');

  // live preview for names
  if (fromInput && previewFrom) {
    fromInput.addEventListener('input', (e) => {
      previewFrom.textContent = e.target.value || '_______';
    });
  }
  
  if (toInput && previewTo) {
    toInput.addEventListener('input', (e) => {
      previewTo.textContent = e.target.value || '_______';
    });
  }

  // oath checkbox >>> enable "I'm ready" button
  if (oathCheckbox && readyBtn) {
    oathCheckbox.addEventListener('change', (e) => {
      readyBtn.disabled = !e.target.checked;
    });
  }

  // Uncertainty slider → dynamic label
  if (uncertaintySlider) {
    // initialize label for default value
    updateSliderLabel(uncertaintySlider.value);
    uncertaintySlider.addEventListener('input', (e) => {
      updateSliderLabel(e.target.value);
    });
  }
  
  // Form submission
  const form = document.getElementById('letterForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const fromName = document.getElementById('fromName').value;
      const toName = document.getElementById('toName').value;
      const toEmail = document.getElementById('toEmail').value;
      const messageBody = document.getElementById('messageBody').value;

            const mailContainer = document.getElementById('mailContainer');
      if (mailContainer) {
        mailContainer.classList.add('sent');
      }

      
      // ENCRYPT message body
      const encrypted = CryptoJS.AES.encrypt(messageBody, ENCRYPTION_KEY).toString();
      
      // Send to server
      try {
        const response = await fetch('/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fromName,
            toName,
            toEmail,
            ciphertext: encrypted
          })
        });
        
                if (response.ok) {
          // Clear form fields
          form.reset();
          if (previewFrom) previewFrom.textContent = '_______';
          if (previewTo) previewTo.textContent = '_______';

          // Let the envelope animation play, then move to confirmation
          setTimeout(() => { // unfortunately does not work yet
            nextScreen(6);
          }, 3000);
        } else {
          alert('Something went wrong. Please try again.');
          if (mailContainer) {
            mailContainer.classList.remove('sent');
          }
        }

      } catch (error) {
        console.error('Error sending message:', error);
        alert('Could not send message. Please check your connection.');
        const mailContainer = document.getElementById('mailContainer');
        if (mailContainer) {
          mailContainer.classList.remove('sent');
        }
      }

    });
  }
});

function answerQuestion(choice) {
  const buttons = document.querySelectorAll('.choice-btn');
  buttons.forEach(btn => btn.style.display = 'none');

  const response = document.getElementById('answerResponse');
  const answerText = document.getElementById('answerText');

  let text = "";

  switch (choice) {
    case 'race':
      text =
        'Your thoughts run ahead of the moment and invent futures that do not exist yet.<br>' +
        'A small signal on a screen can turn stillness into a chase.<br><br>' +
        '<em>"To wait is to feel the shape of time."  Byung-Chul Han</em>';
      break;

    case 'soften':
      text =
        'Your thoughts loosen and fall into a slower rhythm.<br>' +
        'For a brief second the silence feels kind rather than sharp.<br><br>' +
        '<em>"To wait is to feel the shape of time."  Byung-Chul Han</em>';
      break;

    case 'scatter':
      text =
        'Your attention breaks into pieces as you imagine every possible reply.<br>' +
        'The pause becomes a room filled with too many doors.<br><br>' +
        '<em>"To wait is to feel the shape of time."  Byung-Chul Han</em>';
      break;

    default:
      text =
        'Something quiet stirs in the gap before a reply.<br><br>' +
        '<em>"To wait is to feel the shape of time."  Byung-Chul Han</em>';
  }

  answerText.innerHTML = text;
  response.classList.add('show');
}
