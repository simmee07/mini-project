document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            document.getElementById(targetId).classList.add('active');
            
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            this.classList.add('active');
        });
    });

    // Slideshow
    let slideIndex = 0;
    showSlides();

    function showSlides() {
        const slides = document.getElementsByClassName("slide");
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > slides.length) {slideIndex = 1}
        slides[slideIndex-1].style.display = "block";
        setTimeout(showSlides, 10000); // Change slide every 10 seconds
    }

   // Personal Form Submission
const personalForm = document.getElementById('personal-form');
const personalDataDisplay = document.getElementById('personal-data-content');
const bmiDisplay = document.getElementById('bmi-display');
const riskAssessment = document.getElementById('risk-assessment');

personalForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    
    // Calculate BMI
    const heightInMeters = data.height / 100;
    const bmi = (data.weight / (heightInMeters * heightInMeters)).toFixed(2);
    let bmiCategory = '';

    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi >= 18.5 && bmi < 25) bmiCategory = 'Normal weight';
    else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight';
    else bmiCategory = 'Obese';

    // Risk Assessment
    let riskScore = 0;
    const maxRiskScore = 100;
    let riskFactors = [];

    if (parseInt(data.age) > 60) {
        riskScore += 14;
        riskFactors.push('Age over 60');
    }
    if (bmi >= 30) {
        riskScore += 12;
        riskFactors.push('Obesity');
    }
    if (parseInt(data.pulse) > 100) {
        riskScore += 7;
        riskFactors.push('High resting pulse');
    }
    if (parseInt(data.stress) >= 4) {
        riskScore += 17;
        riskFactors.push('High stress level');
    }
    if (data.alcohol === 'yes') {
        riskScore += 7;
        riskFactors.push('Alcohol consumption');
    }
    if (data.smoke === 'yes, 1-2 cigarette a week') {
        riskScore += 3;
        riskFactors.push('You can quit cigarette easily');
    }
    if (data.gender === 'male') {
        riskScore += 2;
    }
    if (data.smoke === 'yes, 10-14 cigarette a week') {
        riskScore += 7;
        riskFactors.push('You smoke a lot, it may harm you seriously');
    }
    if (data.smoke === 'yes, 3-5 cigarette per day') {
        riskScore += 13;
        riskFactors.push('You are close to having a heart disease if you smoke at this rate');
    }
    if (parseInt(data.active) <= 3) {
        riskScore +=5 ;
        riskFactors.push('Body is very less active. Workout,walk and also do some cardio');
    }
    if (parseInt(data.diet) <= 3) {
        riskScore +=5 ;
        riskFactors.push('Your diet is poor.');
    }
    if (data.kidney === 'yes') {
        riskScore += 8;
        riskFactors.push('Your medical conditions are not good');
    }
    const riskPercentage = (riskScore / maxRiskScore) * 100;
    let riskLevel = 'Low';

    if (riskPercentage >= 60) {
        riskLevel = 'High';
    } else if (riskPercentage >= 30) {
        riskLevel = 'Moderate';
    }

    // Display the personal data
    personalDataDisplay.innerHTML = `
        <p><strong>Height:</strong> ${data.height} cm</p>
        <p><strong>Weight:</strong> ${data.weight} kg</p>
        <p><strong>Age:</strong> ${data.age}</p>
        <p><strong>Pulse:</strong> ${data.pulse}</p>
        <p><strong>Gender:</strong> ${data.gender}</p>
        <p><strong>Stress Level:</strong> ${data.stress}</p>
        <p><strong>Consume Alcohol:</strong> ${data.alcohol}</p>
        <p><strong>Previous records of health issues in family?</strong> ${data.fam-history}</p>
        <p><strong>Do you smoke?if yes,how often::</strong> ${data.smoke}</p>
        <p><strong>Are You Married</strong> ${data.married}</p>
        <p><strong>How much would you rate your daily activity level out of (1-5):</strong> ${data.active}</p>
        <p><strong>How would you like to rate your diet?</strong> ${data.diet}</p>
        <p><strong>Any previous cases of kidney failure?</strong> ${data.kidney}</p>

    `;

    // Display BMI
    bmiDisplay.innerHTML = `
        <h4>Body Mass Index (BMI)</h4>
        <p>Your BMI: ${bmi}</p>
        <p>Category: ${bmiCategory}</p>
    `;

    // Display Risk Assessment
    riskAssessment.innerHTML = `
        <h4>Risk Assessment</h4>
        <p class="risk-level ${riskLevel.toLowerCase()}-risk">Risk Level: ${riskLevel}</p>
        <p>Risk Percentage: ${riskPercentage.toFixed(2)}%</p>
        <p>Risk Factors: ${riskFactors.join(', ') || 'None identified'}</p>
        <p>Note: This is a basic assessment. Please consult a healthcare professional for a comprehensive evaluation.</p>
    `;

    // Send data to backend
    fetch('/api/personal-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, bmi, bmiCategory, riskPercentage, riskLevel, riskFactors}),
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
        alert('Personal information saved!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error saving personal information. Please try again.');
    });
});

    // Health Metrics Tracking
    const trackForm = document.getElementById('track-form');
    const healthData = {
        labels: [],
        datasets: [
            {
                label: 'Blood Pressure (Systolic)',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            },
            {
                label: 'Blood Pressure (Diastolic)',
                data: [],
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1
            },
            {
                label: 'Blood Sugar',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: 'Cholesterol',
                data: [],
                borderColor: 'rgb(255, 206, 86)',
                tension: 0.1
            },
            {
                label: 'Resting ECG',
                data: [],
                borderColor: 'rgb(153, 102, 255)',
                tension: 0.1
            }
        ]
    };

    const ctx = document.getElementById('healthChart').getContext('2d');
    const healthChart = new Chart(ctx, {
        type: 'line',
        data: healthData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    trackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        const date = new Date().toLocaleDateString();
        healthData.labels.push(date);
        
        healthData.datasets[0].data.push(data['bp-systolic']);
        healthData.datasets[1].data.push(data['bp-diastolic']);
        healthData.datasets[2].data.push(data['sugar']);
        healthData.datasets[3].data.push(data['cholesterol']);
        healthData.datasets[4].data.push(data['ecg']);
        
        healthChart.update();
        
        // Send data to backend
        fetch('/api/health-metrics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...data, date}),
        })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
            alert('Health metrics added!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error saving health metrics. Please try again.');
        });

        this.reset();
    });

    // QRT Form Submission
    const qrtForm = document.getElementById('qrt-form');
    const qrtResult = document.getElementById('qrt-result');

    qrtForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // Simple risk assessment logic (this should be more comprehensive in a real application)
        let riskLevel = 'Low';
        let riskFactors = [];
        
        if (data.restlessness === 'yes') riskFactors.push('Restlessness');
        if (data.fatigue === 'yes') riskFactors.push('Fatigue');
        if (data.swelling === 'yes') riskFactors.push('Ankle swelling');
        if (data['chest-pain'] === 'medium' || data['chest-pain'] === 'severe') {
            riskFactors.push('Significant chest pain');
            riskLevel = 'High';
        } else if (riskFactors.length > 1) {
            riskLevel = 'Medium';
        }
        
        // Display the QRT result
        qrtResult.innerHTML = `
            <h3>Risk Assessment Result</h3>
            <p><strong>Risk Level:</strong> ${riskLevel}</p>
            <p><strong>Risk Factors:</strong> ${riskFactors.join(', ') || 'None identified'}</p>
            <p>Please consult with a healthcare professional for a comprehensive evaluation.</p>
        `;
        
        // Send data to backend
        fetch('/api/qrt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...data, riskLevel, riskFactors}),
        })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
            alert('QRT submitted!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error submitting QRT. Please try again.');
        });
    });
});
/*fetch('/api/personal-data', {
    // ... rest of the fetch call
  })
  
  fetch('/api/health-metrics', {
    // ... rest of the fetch call
  })
  
  fetch('/api/qrt', {
    // ... rest of the fetch call
  })*/