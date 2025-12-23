# FlashQuiz+

A React.js web application that allows students to upload study documents (PDF, DOCX, or TXT) and instantly generate quizzes or flashcards for interactive study practice.

## Features

### Core Features
- **Document Upload**: Support for PDF, DOCX, and TXT files with drag-and-drop interface
- **Text Extraction**: Automatic text extraction from uploaded documents
- **Quiz Generation**: Rule-based generation of multiple-choice questions from document content
- **Flashcard Generation**: Automatic creation of flashcards with front and back content
- **Interactive Quiz Taking**: Answer questions with instant feedback and progress tracking
- **Flashcard Viewer**: Flip-through flashcards with 3D flip animation
- **Statistics & Insights**: Track quiz performance, correct answers, and identify weak topics

### Bonus Features
- **Dark/Light Mode**: Toggle between themes with persistent storage
- **Timer**: Track time spent on quiz attempts
- **Shareable Quizzes**: Generate shareable links for quizzes (bonus feature)
- **Responsive Design**: Clean, modern UI that works on all devices

## Tech Stack

- **React.js** - UI framework
- **Tailwind CSS** - Styling and responsive design
- **PDF.js** - PDF text extraction
- **Mammoth** - DOCX text extraction
- **JavaScript** - Core logic and file parsing

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. **Set up Firebase (Optional - for Google Sign-in):**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable Google Authentication: Go to Authentication > Sign-in method > Google > Enable
   - Get your Firebase config: Project Settings > General > Your apps > Web app
   - Create a `.env` file in the root directory with:
     ```
     REACT_APP_FIREBASE_API_KEY=your-api-key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
     REACT_APP_FIREBASE_PROJECT_ID=your-project-id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     REACT_APP_FIREBASE_APP_ID=your-app-id
     ```
   - **Note:** Without Firebase configured, the app will work with local user profiles only

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Upload Document**: Click the upload area or drag and drop a PDF, DOCX, or TXT file
2. **Generate Content**: The app automatically extracts text and generates quiz questions and flashcards
3. **Take Quiz**: Navigate to the Quiz tab and answer multiple-choice questions
4. **Study Flashcards**: Use the Flashcards tab to review content with flip animations
5. **View Statistics**: Check your performance, scores, and weak topics in the Statistics tab

## Project Structure

```
flashquiz-plus/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── FileUpload.js      # File upload component
│   │   ├── Quiz.js            # Quiz interface
│   │   ├── Flashcard.js       # Flashcard viewer
│   │   ├── Statistics.js      # Performance statistics
│   │   ├── Timer.js           # Quiz timer
│   │   ├── ThemeToggle.js     # Dark/light mode toggle
│   │   └── ShareQuiz.js       # Share quiz functionality
│   ├── utils/
│   │   ├── fileParser.js      # Text extraction from files
│   │   ├── quizGenerator.js   # Quiz question generation
│   │   ├── flashcardGenerator.js  # Flashcard generation
│   │   └── storage.js         # Local storage utilities
│   ├── App.js                 # Main app component
│   ├── index.js               # App entry point
│   └── index.css              # Global styles
├── package.json
├── tailwind.config.js
└── README.md
```

## How It Works

### Text Extraction
- **PDFs**: Uses PDF.js to extract text from each page
- **DOCX**: Uses Mammoth.js to extract raw text
- **TXT**: Uses FileReader API to read plain text

### Quiz Generation
The app uses rule-based logic to generate questions:
1. Splits text into sentences
2. Extracts key terms and concepts
3. Creates fill-in-the-blank style questions
4. Generates distractors from other terms in the document
5. Formats as multiple-choice questions

### Flashcard Generation
1. Identifies definition sentences
2. Extracts key terms and their explanations
3. Creates front/back pairs
4. Organizes by topic when possible

## Building for Production

To create a production build:

```bash
npm run build
```

This creates an optimized build in the `build` folder.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Limitations

- File size limit: 10MB
- Best results with well-structured documents
- Quiz quality depends on document content and structure
- Some complex PDF layouts may not extract perfectly

## Future Enhancements

- AI-powered question generation (OpenAI API integration)
- Export quizzes as PDF
- User accounts and cloud storage
- More question types (true/false, fill-in-the-blank)
- Study scheduling and reminders
- Collaborative quiz sharing

## License

This project is open source and available for educational purposes.

## Credits

Built with React.js, Tailwind CSS, PDF.js, and Mammoth.js.
