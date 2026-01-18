# Taxi-service
A simple and reliable taxi booking app that allows users to get a quote viewing transparent fare estimates,  book in advance, customize their trip, and contact the driver instantly via WhatsApp for quick confirmation and personalized service.

# User Experience
1. Intuitive Fare Calculation 
The app provides a friction-less "Estimate to Booking" flow. Users select their destination and the UI updates dynamically:

- Dynamic Pricing: As the user selects Extras (e.g., child seats), the total fare is recalculated instantly using JavaScript event listeners.

- Visual Itinerary: Upon selecting a destination, the app renders a clear itinerary (e.g., "Airport → City Center"), giving the user immediate visual confirmation of their route indicating also travel time and distance.

- Direct Driver Contact: To reduce "booking friction," the app includes a floating Direct Contact button. Using dynamic DOM attributes, the app can trigger a WhatsApp message or Phone call pre-filled with the calculated itinerary details.

# Front-End & Interactivity
Structure: Built with Semantic HTML5 for SEO and accessibility (WCAG compliant).

# Responsiveness
Uses a "Mobile-First" approach with CSS Flexbox/Grid and Media Queries to ensure a perfect layout across mobile, tablet, and desktop.

# Dynamic UI

- Real-time Price Calculator: Uses input listeners and logic to instantly update travel costs based on user selection.

- Live Itinerary Display: Dynamically renders route details and destination information into the DOM without page refreshes.

- Theme Toggle: Implements a Dark/Light mode switcher.
<img width="2532" height="2292" alt="Taxi Booking | Get Your Quote light" src="https://github.com/user-attachments/assets/4e4fff30-8cc9-4952-a6f5-51c36b0bf86f" />
<img width="2532" height="2292" alt="Taxi Booking | Get Your Quote Dark" src="https://github.com/user-attachments/assets/2cdebe57-d856-4bd9-90c0-d078e59d39a8" />


#  Code Quality & Standards 
Separation of Concerns: HTML, CSS, and JS are kept in separate external files for maintainability.

# Validation
All code is validated through W3C (HTML), Jigsaw (CSS), and passed through a JavaScript Linter to ensure zero syntax errors.
<img width="1249" height="555" alt="Screenshot 2026-01-18 at 21 45 06" src="https://github.com/user-attachments/assets/fcb6ab67-581c-41e3-8028-e41e849bd315" />

<img width="1223" height="493" alt="Screenshot 2026-01-18 at 22 14 24" src="https://github.com/user-attachments/assets/96131155-019b-4e8d-a92d-44e25832c5fc" />

# Documentation
The project includes a professional README.md with wireframes, feature explanations, and clear deployment instructions.

# AI Tool Usage & Reflection
ChatGPT (Logic & Planning) and GitHub Copilot (Coding & Debugging).

- Code Generation: I used ChatGPT to architect the core JavaScript functions, specifically the logic for the real-time fare calculator and the itinerary rendering.

- Debugging & Optimization: GitHub Copilot was used to identify and correct syntax errors during development.

Reflection:  While it accelerated the development of repetitive tasks, I had to manually review all code to ensure it met project-specific requirements and WCAG accessibility standards. This process allowed me to focus more on the user experience and the logic.
AI Usage: Leveraged AI tools (like ChatGPT/GitHub Copilot) for logic debugging, UX optimization suggestions, and generating boilerplate code.
# Conclusion
This project was used to create website https://www.gpa-travel.it (work still in progress)
<img width="1500" height="auto" alt="GPA TAXI copy" src="https://github.com/user-attachments/assets/14775e9d-e6d9-46e1-9537-88e313011b7e" />

