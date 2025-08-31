let attendanceChart = null;

function analyzeAttendance() {
    const totalClasses = parseInt(document.getElementById('totalClasses').value);
    const classesAttended = parseInt(document.getElementById('classesAttended').value);
    const targetAttendance = parseInt(document.getElementById('targetAttendance').value);

    if (!totalClasses || !classesAttended || !targetAttendance) {
        alert('Please fill in all fields with valid numbers.');
        return;
    }

    if (classesAttended > totalClasses) {
        alert('Classes attended cannot be greater than total classes.');
        return;
    }

    const currentPercentage = ((classesAttended / totalClasses) * 100).toFixed(1);

    const requiredClasses = Math.ceil((targetAttendance / 100) * totalClasses);
    const classesNeeded = Math.max(0, requiredClasses - classesAttended);

    const canMiss = Math.max(0, totalClasses - requiredClasses - (totalClasses - classesAttended));

    document.getElementById('currentPercentage').textContent = currentPercentage + '%';
    document.getElementById('requiredClasses').textContent = classesNeeded;
    document.getElementById('canMiss').textContent = canMiss;

    document.getElementById('attendanceStatus').innerHTML = `
        You've attended <strong>${classesAttended}</strong> out of <strong>${totalClasses}</strong> classes.
    `;

    document.getElementById('targetDetails').innerHTML = `
        You need to attend <strong>${classesNeeded}</strong> more classes<br>
        to reach ${targetAttendance}% attendance.
    `;

    document.getElementById('missDetails').innerHTML = `
        You can afford to miss <strong>${canMiss}</strong> more classes<br>
        while maintaining your target.
    `;

    document.getElementById('resultsSection').style.display = 'grid';
    document.getElementById('exportBtn').style.display = 'inline-block';

    generateMonthlyPlan(totalClasses, classesAttended, targetAttendance);
}

function generateMonthlyPlan(totalClasses, classesAttended, targetAttendance) {
    const requiredClasses = Math.ceil((targetAttendance / 100) * totalClasses);
    const classesNeeded = Math.max(0, requiredClasses - classesAttended);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const classesPerMonth = Math.ceil(classesNeeded / 12);

    const ctx = document.getElementById('attendanceChart').getContext('2d');

    if (attendanceChart) {
        attendanceChart.destroy();
    }

    attendanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Classes Needed per Month',
                data: Array(12).fill(classesPerMonth),
                backgroundColor: '#cdb4db',
                borderColor: '#a2d2ff',
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: '#ffafcc'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: `Average ${classesPerMonth} classes per month to reach target` }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Classes' } }
            }
        }
    });

    document.getElementById('monthlyPlan').style.display = 'block';
}

function exportReport() {
    const totalClasses = document.getElementById('totalClasses').value;
    const classesAttended = document.getElementById('classesAttended').value;
    const targetAttendance = document.getElementById('targetAttendance').value;
    const currentPercentage = document.getElementById('currentPercentage').textContent;
    const classesNeeded = document.getElementById('requiredClasses').textContent;
    const canMiss = document.getElementById('canMiss').textContent;

    const report = `
Attendance Report
================

Total Classes: ${totalClasses}
Classes Attended: ${classesAttended}
Target Attendance: ${targetAttendance}%

Current Attendance: ${currentPercentage}
Classes Needed to Reach Target: ${classesNeeded}
Classes You Can Afford to Miss: ${canMiss}

Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.input-field');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value) {
                this.style.borderColor = '#ffafcc';
            } else {
                this.style.borderColor = '#cdb4db';
            }
        });
    });
});
// for anchor tags and reload like homebtn, about!
document.getElementById("homebtn").addEventListener("click", function(event) {
    event.preventDefault();   
    location.reload();      
});


document.getElementById("supportbtn").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent page jump
    document.getElementById("feedbackForm").scrollIntoView({
        behavior: "smooth"  // smooth scrolling
    });
});