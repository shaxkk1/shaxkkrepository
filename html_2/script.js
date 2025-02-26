// Initialize reviews array from localStorage
let reviews = JSON.parse(localStorage.getItem('campingReviews')) || [];

document.addEventListener("DOMContentLoaded", () => {
    console.log("Camping Tips site loaded.");
  
    let greetingMessage = "Ready for your next adventure?";
    let currentHour = new Date().getHours();
    let isMorning = currentHour < 12;
  
    if (isMorning) {
      greetingMessage = "Good morning, camper!";
    } else {
      greetingMessage = "Good afternoon, camper!";
    }
  
    // Example of mathematical operation
    let hoursUntilNoon = isMorning ? 12 - currentHour : 0; 
  
    // Logical operator example
    if (isMorning && hoursUntilNoon < 3) {
      greetingMessage += " Almost noon!";
    }
  
    // Displaying output in both console and webpage
    console.log(`Current Hour: ${currentHour}, Hours until noon: ${hoursUntilNoon}`);
    document.body.insertAdjacentHTML("beforeend", `<p>${greetingMessage}</p>`);

    // Handle form submission on index.html
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const rating = document.getElementById('rating').value;
            const experience = document.getElementById('experience').value;
            const recommend = document.getElementById('recommend').checked;
            
            // Create new review object
            const review = {
                rating: parseFloat(rating),
                experience: experience,
                recommend: recommend,
                date: new Date().toLocaleDateString()
            };
            
            // Add to reviews array
            reviews.push(review);
            
            // Save to localStorage
            localStorage.setItem('campingReviews', JSON.stringify(reviews));
            
            // Clear form
            reviewForm.reset();
            
            // Redirect to reviews page
            window.location.href = 'reviews.html';
        });
    }
    
    // Display reviews on reviews.html
    const reviewsList = document.getElementById('reviewsList');
    if (reviewsList) {
        // Clear existing content
        reviewsList.innerHTML = '';
        
        if (reviews.length === 0) {
            reviewsList.innerHTML = '<p style="color: white;">No reviews yet. Be the first to add one!</p>';
        } else {
            // Calculate average rating
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = (totalRating / reviews.length).toFixed(1);
            
            // Add average rating section
            const averageSection = document.createElement('div');
            averageSection.className = 'average-rating';
            averageSection.innerHTML = `
                <h2>Average Rating: ${averageRating} ⭐</h2>
                <p>Based on ${reviews.length} review${reviews.length === 1 ? '' : 's'}</p>
            `;
            reviewsList.appendChild(averageSection);

            // Display individual reviews
            reviews.forEach(review => {
                const reviewCard = document.createElement('div');
                reviewCard.className = 'review-card';
                reviewCard.innerHTML = `
                    <h3>Rating: ${review.rating} ⭐</h3>
                    <p>${review.experience}</p>
                    <p class="recommendation">${review.recommend ? '👍 Would recommend' : '👎 Would not recommend'}</p>
                    <p class="review-date">Posted on: ${review.date}</p>
                `;
                reviewsList.appendChild(reviewCard);
            });
        }
    }
});
  