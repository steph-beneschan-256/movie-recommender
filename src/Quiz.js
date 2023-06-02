import { useRef, useState } from "react"

export default function Quiz({questions, onQuizFinished}) {

    const questionIndex = useRef(0);
    const selectedChoices = useRef([]);
    const [selectedChoice, setSelectedChoice] = useState(null);

    function handleSubmit(e) {
        e.preventDefault();

        console.log(selectedChoices.current);

        const formData = new FormData(e.target);
        console.log(formData);
        selectedChoices.current = selectedChoices.current.concat([formData.get("question")]);
        setSelectedChoice(null);
        if(questionIndex.current + 1 < questions.length) {
            questionIndex.current = questionIndex.current + 1;
        }
        else {
            onQuizFinished(selectedChoices.current);
        }
    }

    function nextQuestion() {
        selectedChoices.current = selectedChoices.current.concat([selectedChoice]);
        setSelectedChoice(null);
        questionIndex.current = questionIndex.current + 1;
    }
    function finishQuiz() {
        selectedChoices.current = selectedChoices.current.concat([selectedChoice]);
        setSelectedChoice(null);
        onQuizFinished(selectedChoices.current);
    }
    
    return (
        <div>
            <form method="post" onSubmit={handleSubmit} class="question">
                <h3>
                    {questions[questionIndex.current].questionText}
                </h3>
                <div class="question-choices">
                    {questions[questionIndex.current].choices.map(choice => {
                        return (
                            <label>
                                <input type="radio" name="question"
                                value={choice.value}
                                onChange={() => setSelectedChoice(choice.value)}
                                checked={selectedChoice === choice.value}
                                />
                                {choice.text}
                            </label>
                            
                        )
                    })}
                </div>

                <button type="submit">
                    {(questionIndex.current < (questions.length - 1)) ? "Next" : "Finish"}
                </button>
            </form>
        </div>
    )
}