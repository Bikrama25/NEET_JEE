// Topics database (simplified - expand with all NCERT/JEE/NEET topics)
const topicsDB = {
    physics: [
        "Mechanics", "Thermodynamics", "Electromagnetism", 
        "Optics", "Modern Physics", "Waves", "Electrostatics"
    ],
    chemistry: [
        "Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry",
        "Chemical Bonding", "Thermodynamics", "Equilibrium", "Biomolecules"
    ],
    mathematics: [
        "Algebra", "Calculus", "Coordinate Geometry",
        "Trigonometry", "Probability", "Vectors", "Matrices"
    ],
    biology: [
        "Botany", "Zoology", "Cell Biology",
        "Genetics", "Ecology", "Human Physiology", "Biotechnology"
    ]
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const now = new Date();
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Subject selection
    const subjectSelect = document.getElementById('subject');
    const topicSelect = document.getElementById('topic');
    
    subjectSelect.addEventListener('change', function() {
        topicSelect.innerHTML = '<option value="">Select Topic</option>';
        topicSelect.disabled = !this.value;
        
        if (this.value) {
            topicsDB[this.value].forEach(topic => {
                const option = document.createElement('option');
                option.value = topic.toLowerCase().replace(/\s+/g, '-');
                option.textContent = topic;
                topicSelect.appendChild(option);
            });
        }
    });

    // Attachment handling
    const uploadBtn = document.getElementById('uploadBtn');
    const cameraBtn = document.getElementById('cameraBtn');
    const fileInput = document.getElementById('fileInput');
    const cameraView = document.getElementById('cameraView');
    const captureBtn = document.getElementById('captureBtn');
    const previewArea = document.getElementById('attachmentPreview');
    
    let attachments = [];
    
    uploadBtn.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', function() {
        Array.from(this.files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    attachments.push(e.target.result);
                    displayAttachments();
                };
                reader.readAsDataURL(file);
            }
        });
    });
    
    cameraBtn.addEventListener('click', async function() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            cameraView.srcObject = stream;
            cameraView.style.display = 'block';
            captureBtn.style.display = 'block';
            cameraBtn.style.display = 'none';
        } catch (err) {
            alert('Could not access camera: ' + err.message);
        }
    });
    
    captureBtn.addEventListener('click', function() {
        const canvas = document.createElement('canvas');
        canvas.width = cameraView.videoWidth;
        canvas.height = cameraView.videoHeight;
        canvas.getContext('2d').drawImage(cameraView, 0, 0);
        
        attachments.push(canvas.toDataURL('image/jpeg'));
        displayAttachments();
        
        // Stop camera
        cameraView.srcObject.getTracks().forEach(track => track.stop());
        cameraView.style.display = 'none';
        captureBtn.style.display = 'none';
        cameraBtn.style.display = 'block';
    });
    
    function displayAttachments() {
        previewArea.innerHTML = '';
        attachments.forEach((att, index) => {
            const div = document.createElement('div');
            div.className = 'attachment-thumbnail';
            
            const img = document.createElement('img');
            img.src = att;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '×';
            deleteBtn.onclick = () => {
                attachments.splice(index, 1);
                displayAttachments();
            };
            
            div.appendChild(img);
            div.appendChild(deleteBtn);
            previewArea.appendChild(div);
        });
    }

    // Form submission
    document.getElementById('progressForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const subject = subjectSelect.value;
        const topic = topicSelect.value;
        const learnings = document.getElementById('learnings').value;
        const confidence = document.querySelector('input[name="confidence"]:checked').value;
        
        // In a real app, save to Firebase/localStorage
        const entry = {
            date: new Date().toISOString(),
            subject,
            topic,
            learnings,
            confidence,
            attachments
        };
        
        // For demo, store in localStorage
        let entries = JSON.parse(localStorage.getItem('studyEntries') || [];
        entries.push(entry);
        localStorage.setItem('studyEntries', JSON.stringify(entries));
        
        alert('Progress saved successfully!');
        this.reset();
        attachments = [];
        previewArea.innerHTML = '';
    });

    // Set up revision reminders
    setInterval(checkReminders, 60000); // Check every minute
    checkReminders();
});

function checkReminders() {
    const now = new Date();
    const hours = now.getHours();
    const day = now.getDay(); // 0 = Sunday
    
    // Check for morning revision (8-10 AM)
    if (hours >= 8 && hours <= 10) {
        const lastOpened = localStorage.getItem('lastMorningReminder');
        const today = now.toDateString();
        
        if (!lastOpened || lastOpened !== today) {
            // Check if there were entries yesterday
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            const entries = JSON.parse(localStorage.getItem('studyEntries') || [];
            const yesterdayEntries = entries.filter(entry => 
                entry.date.split('T')[0] === yesterdayStr
            );
            
            if (yesterdayEntries.length > 0) {
                alert(`Time to revise! You studied ${yesterdayEntries.length} topics yesterday.`);
                localStorage.setItem('lastMorningReminder', today);
            }
        }
    }
    
    // Check for weekend revision (Saturday/Sunday morning)
    if ((day === 0 || day === 6) && hours >= 8 && hours <= 10) {
        const lastWeeklyReminder = localStorage.getItem('lastWeeklyReminder');
        const thisWeek = now.getFullYear() + '-' + now.getWeek(); // Need week number function
        
        if (!lastWeeklyReminder || lastWeeklyReminder !== thisWeek) {
            const entries = JSON.parse(localStorage.getItem('studyEntries') || [];
            const lastWeekEntries = entries.filter(entry => {
                const entryDate = new Date(entry.date);
                return isSameWeek(entryDate, now);
            });
            
            if (lastWeekEntries.length > 0) {
                alert(`Weekly revision time! Review ${lastWeekEntries.length} topics from this week.`);
                localStorage.setItem('lastWeeklyReminder', thisWeek);
            }
        }
    }
}

// Helper function to get week number
Date.prototype.getWeek = function() {
    const date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

function isSameWeek(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() && 
           d1.getWeek() === d2.getWeek();
}
