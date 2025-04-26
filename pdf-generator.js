function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Get all entries from localStorage
    const entries = JSON.parse(localStorage.getItem('studyEntries')) || [];
    
    if (entries.length === 0) {
        alert('No study entries found to generate PDF');
        return;
    }
    
    // Group by subject
    const subjects = {};
    entries.forEach(entry => {
        if (!subjects[entry.subject]) {
            subjects[entry.subject] = [];
        }
        subjects[entry.subject].push(entry);
    });
    
    // Add content for each subject
    Object.entries(subjects).forEach(([subject, entries]) => {
        doc.addPage();
        doc.setFontSize(18);
        doc.text(subject.charAt(0).toUpperCase() + subject.slice(1), 10, 10);
        doc.setFontSize(12);
        
        let y = 20;
        entries.forEach((entry, index) => {
            doc.text(`Date: ${new Date(entry.date).toLocaleDateString()}`, 10, y);
            y += 7;
            doc.text(`Topic: ${entry.topic}`, 10, y);
            y += 7;
            doc.text(`Confidence: ${'★'.repeat(entry.confidence)}`, 10, y);
            y += 7;
            
            // Split learnings into multiple lines if needed
            const learningsLines = doc.splitTextToSize(entry.learnings, 180);
            doc.text('Learnings:', 10, y);
            y += 7;
            learningsLines.forEach(line => {
                doc.text(line, 15, y);
                y += 7;
            });
            
            // Add images if available
            if (entry.attachments && entry.attachments.length > 0) {
                y += 5;
                doc.text('Attachments:', 10, y);
                y += 7;
                
                entry.attachments.forEach((imgSrc, imgIndex) => {
                    if (y > 250) { // Page break if near bottom
                        doc.addPage();
                        y = 20;
                    }
                    
                    try {
                        const img = new Image();
                        img.src = imgSrc;
                        
                        // Add image to PDF (scaled to fit)
                        const ratio = img.width / img.height;
                        const width = 100;
                        const height = width / ratio;
                        
                        doc.addImage(imgSrc, 'JPEG', 10, y, width, height);
                        y += height + 5;
                    } catch (e) {
                        console.error('Error adding image:', e);
                    }
                });
            }
            
            // Add space between entries
            y += 10;
            
            // Page break if needed
            if (y > 280 && index < entries.length - 1) {
                doc.addPage();
                y = 20;
            }
        });
    });
    
    // Save the PDF
    doc.save('neet-jee-study-notes.pdf');
}

// Add event listener to PDF generation button
document.getElementById('generatePdfBtn').addEventListener('click', generatePDF);
