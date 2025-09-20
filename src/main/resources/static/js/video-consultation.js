// Video Consultation JavaScript

let jitsiApi = null;
let consultationStartTime = null;
let consultationTimer = null;
let currentBooking = null;
let isMuted = false;
let isVideoOn = true;
let isScreenSharing = false;
let isChatVisible = true;

// Initialize video consultation
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadBookingDetails();
    setupEventListeners();
});

function setupEventListeners() {
    // Chat input enter key
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Session notes auto-save
    document.getElementById('sessionNotes').addEventListener('input', debounce(saveNotes, 2000));
}

function checkAuthentication() {
    const user = LegalSahyogHub.getCurrentUser();
    if (!user) {
        showAlert('Please login to access consultation', 'error');
        window.location.href = 'login.html';
        return;
    }
}

function loadBookingDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('bookingId');
    
    if (!bookingId) {
        showAlert('No booking ID provided', 'error');
        window.location.href = 'user-dashboard.html';
        return;
    }
    
    fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
        headers: {
            'Authorization': `Bearer ${LegalSahyogHub.getAuthToken()}`
        }
    })
    .then(response => response.json())
    .then(booking => {
        currentBooking = booking;
        displayBookingDetails(booking);
    })
    .catch(error => {
        console.error('Error loading booking:', error);
        showAlert('Failed to load booking details', 'error');
    });
}

function displayBookingDetails(booking) {
    document.getElementById('consultationProvider').textContent = 
        `${booking.provider.firstName} ${booking.provider.lastName}`;
    document.getElementById('consultationService').textContent = booking.service.title;
    document.getElementById('consultationDate').textContent = 
        new Date(booking.bookingDate).toLocaleDateString();
    document.getElementById('consultationTime').textContent = 
        `${booking.startTime} - ${booking.endTime}`;
    document.getElementById('providerName').textContent = 
        `${booking.provider.firstName} ${booking.provider.lastName}`;
}

function startConsultation() {
    if (!currentBooking) {
        showAlert('Booking details not loaded', 'error');
        return;
    }
    
    // Hide pre-consultation screen
    document.getElementById('preConsultation').style.display = 'none';
    document.getElementById('videoConsultation').style.display = 'block';
    
    // Initialize Jitsi Meet
    initializeJitsiMeet();
    
    // Start consultation timer
    startConsultationTimer();
    
    // Update booking status to confirmed if it's pending
    if (currentBooking.status === 'PENDING') {
        updateBookingStatus('CONFIRMED');
    }
}

function initializeJitsiMeet() {
    const domain = 'meet.jit.si';
    const options = {
        roomName: `legal-consultation-${currentBooking.id}`,
        width: '100%',
        height: '100%',
        parentNode: document.getElementById('jitsi-container'),
        userInfo: {
            displayName: LegalSahyogHub.getCurrentUser().firstName,
            email: LegalSahyogHub.getCurrentUser().email
        },
        configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            enableWelcomePage: false,
            prejoinPageEnabled: false,
            disableModeratorIndicator: true,
            startScreenSharing: false,
            enableEmailInStats: false
        },
        interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
                'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
                'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
            ],
            SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            SHOW_POWERED_BY: false
        }
    };
    
    jitsiApi = new JitsiMeetExternalAPI(domain, options);
    
    // Event listeners
    jitsiApi.addListener('videoConferenceJoined', onVideoConferenceJoined);
    jitsiApi.addListener('videoConferenceLeft', onVideoConferenceLeft);
    jitsiApi.addListener('participantJoined', onParticipantJoined);
    jitsiApi.addListener('participantLeft', onParticipantLeft);
    jitsiApi.addListener('audioMuteStatusChanged', onAudioMuteStatusChanged);
    jitsiApi.addListener('videoMuteStatusChanged', onVideoMuteStatusChanged);
}

function onVideoConferenceJoined() {
    console.log('Joined video conference');
    consultationStartTime = new Date();
}

function onVideoConferenceLeft() {
    console.log('Left video conference');
    endConsultation();
}

function onParticipantJoined(participant) {
    console.log('Participant joined:', participant);
    updateParticipantList();
}

function onParticipantLeft(participant) {
    console.log('Participant left:', participant);
    updateParticipantList();
}

function onAudioMuteStatusChanged(data) {
    isMuted = data.muted;
    updateMuteButton();
}

function onVideoMuteStatusChanged(data) {
    isVideoOn = !data.muted;
    updateVideoButton();
}

function startConsultationTimer() {
    consultationTimer = setInterval(() => {
        if (consultationStartTime) {
            const elapsed = new Date() - consultationStartTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            document.getElementById('consultationTimer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function toggleMute() {
    if (jitsiApi) {
        jitsiApi.executeCommand('toggleAudio');
    }
}

function toggleVideo() {
    if (jitsiApi) {
        jitsiApi.executeCommand('toggleVideo');
    }
}

function toggleScreenShare() {
    if (jitsiApi) {
        jitsiApi.executeCommand('toggleShareScreen');
        isScreenSharing = !isScreenSharing;
    }
}

function toggleChat() {
    if (jitsiApi) {
        jitsiApi.executeCommand('toggleChat');
        isChatVisible = !isChatVisible;
    }
}

function updateMuteButton() {
    const muteBtn = document.getElementById('muteBtn');
    const icon = muteBtn.querySelector('i');
    if (isMuted) {
        muteBtn.classList.remove('btn-danger');
        muteBtn.classList.add('btn-secondary');
        icon.className = 'fas fa-microphone-slash';
    } else {
        muteBtn.classList.remove('btn-secondary');
        muteBtn.classList.add('btn-danger');
        icon.className = 'fas fa-microphone';
    }
}

function updateVideoButton() {
    const videoBtn = document.getElementById('videoBtn');
    const icon = videoBtn.querySelector('i');
    if (isVideoOn) {
        videoBtn.classList.remove('btn-secondary');
        videoBtn.classList.add('btn-primary');
        icon.className = 'fas fa-video';
    } else {
        videoBtn.classList.remove('btn-primary');
        videoBtn.classList.add('btn-secondary');
        icon.className = 'fas fa-video-slash';
    }
}

function updateParticipantList() {
    // This would be implemented to show current participants
    // For now, we'll keep the static list
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = 'mb-2';
        messageElement.innerHTML = `
            <div class="d-flex justify-content-end">
                <div class="bg-primary text-white p-2 rounded" style="max-width: 80%;">
                    ${message}
                </div>
            </div>
        `;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        chatInput.value = '';
    }
}

function saveNotes() {
    const notes = document.getElementById('sessionNotes').value;
    // In a real implementation, you would save notes to the backend
    console.log('Saving notes:', notes);
    showAlert('Notes saved', 'success');
}

function endConsultation() {
    const modal = new bootstrap.Modal(document.getElementById('endConsultationModal'));
    modal.show();
}

function confirmEndConsultation() {
    if (jitsiApi) {
        jitsiApi.dispose();
    }
    
    if (consultationTimer) {
        clearInterval(consultationTimer);
    }
    
    // Update booking status to completed
    updateBookingStatus('COMPLETED');
    
    // Redirect to feedback page
    setTimeout(() => {
        window.location.href = `feedback.html?bookingId=${currentBooking.id}`;
    }, 2000);
}

function updateBookingStatus(status) {
    fetch(`http://localhost:8080/api/bookings/${currentBooking.id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LegalSahyogHub.getAuthToken()}`
        },
        body: JSON.stringify({ status: status })
    })
    .then(response => response.json())
    .then(booking => {
        currentBooking = booking;
        console.log('Booking status updated:', status);
    })
    .catch(error => {
        console.error('Error updating booking status:', error);
    });
}

function testAudioVideo() {
    // Simple audio/video test
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            showAlert('Audio and video are working correctly!', 'success');
            // Stop the test stream
            stream.getTracks().forEach(track => track.stop());
        })
        .catch(error => {
            showAlert('Please check your camera and microphone permissions', 'warning');
        });
}

function toggleSidebar() {
    const sidebar = document.getElementById('consultationSidebar');
    sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
}

function showAlert(message, type = 'info') {
    // Create a simple alert notification
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle page unload
window.addEventListener('beforeunload', function(e) {
    if (jitsiApi) {
        jitsiApi.dispose();
    }
});
