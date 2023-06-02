import { useRef, useState } from "react";
import BIG_FIVE_TRAITS from "./BigFive";

// TODO: maybe put the constants in a separate file?

// Pseudo-enum for the Big Five Personality traits

/*
For each question on the TIPI form, the user will select a value from 1 to (2*DEGREES_OF_AGREEMENT+1) (inclusive), where 1 means "strongly disagree", (DEGREES_OF_AGREEMENT+1) means "neither agree nor disagree", and the maximum value means "strongly agree"
*/
const DEGREES_OF_AGREEMENT = 3;

const DEGREE_LABELS = [
    "Strongly disagree",
    "Moderately disagree",
    "Slightly disagree",
    "Neither agree nor disagree",
    "Agree a little",
    "Agree moderately",
    "Agree strongly"
]

/*
For each question, the user will be shown a statement of this form:
"You see yourself as [DISPLAY_TEXT]."
For each questions, QUESTIONS stores the value of [DISPLAY_TEXT], which Big Five personality trait this particular question measures, and the scale is reversed (i.e. whether a higher number on the scale indicates a greater or lesser expression of the trait).
*/
const QUESTIONS = [
    {
        displayText: "extraverted; enthusiastic",
        trait: BIG_FIVE_TRAITS.extraversion,
        reversed: false
    },
    {
        displayText: "critical; quarrelsome",
        trait: BIG_FIVE_TRAITS.agreeableness,
        reversed: true
    },
    {
        displayText: "dependable; self-disciplined",
        trait: BIG_FIVE_TRAITS.conscientiousness,
        reversed: false
    },
    {
        displayText: "anxious; easily upset",
        trait: BIG_FIVE_TRAITS.emotionalStability,
        reversed: true
    },
    {
        displayText: "open to new experiences; complex",
        trait: BIG_FIVE_TRAITS.opennessToExperiences,
        reversed: false
    },
    {
        displayText: "reserved; quiet",
        trait: BIG_FIVE_TRAITS.extraversion,
        reversed: true
    },
    {
        displayText: "sympathetic; warm",
        trait: BIG_FIVE_TRAITS.agreeableness,
        reversed: false
    },
    {
        displayText: "disorganized; careless",
        trait: BIG_FIVE_TRAITS.conscientiousness,
        reversed: true
    },
    {
        displayText: "calm; emotionally stable",
        trait: BIG_FIVE_TRAITS.emotionalStability,
        reversed: false
    },
    {
        displayText: "conventional; uncreative",
        trait: BIG_FIVE_TRAITS.opennessToExperiences,
        reversed: true
    }
]

export default function TIPIForm({onFinished}) {
    /*
    Keep track of the user's answers over time.
    If the user wants to go back to a previous question, we should be able to pop the most recent value from this array, leaving the other values intact.
    */
    const [userAnswers, setUserAnswers] = useState([]);

    // Current question being displayed to the user
    const [questionIndex, setQuestionIndex] = useState(0);

    // The value that the user has currently selected on the slider widget
    const [selectedValue, setSelectedValue] = useState(DEGREES_OF_AGREEMENT + 1);

    function nextQuestion() {
        const newUserAnswers = [...userAnswers, parseFloat(selectedValue)];
        setUserAnswers(newUserAnswers);
        const newQuestionIndex = questionIndex + 1;
        if(newQuestionIndex < QUESTIONS.length) {
            setSelectedValue(DEGREES_OF_AGREEMENT + 1); // Return slider to default value
            setQuestionIndex(newQuestionIndex);
        }
        else
            onFinished(calculateTraitScores(newUserAnswers));

        console.log(newUserAnswers);
        
    }

    function prevQuestion() {
        if(questionIndex > 0) {
            const prevAnswer = userAnswers[userAnswers.length-1];
            console.log(prevAnswer);
            setUserAnswers(userAnswers.slice(0,-1));
            setQuestionIndex(questionIndex - 1);
            setSelectedValue(prevAnswer); // Return slider to previous value
        }
    }

    //TODO: try to simplify this function; maybe rename totalTraitScores variable, and reconsider use of enum for Big Five traits

    /*
    Get the user's average score for each trait, then calculate its difference from the mean as a proportion of the maximum/minimum possible value [TODO: reword this...]
    */

    function calculateTraitScores(finalAnswers = userAnswers) {

        let totalTraitScores = {}; // Temporary variable to store the total scores of each trait

        BIG_FIVE_TRAITS.traits.forEach((trait) => {
            totalTraitScores[trait] = [];
        });
        finalAnswers.forEach((answer, index) => {
            const question = QUESTIONS[index];
            const measuredTrait = question.trait;
            // Get the score as a value in [-1, 1]
            const weightedAnswer = (answer - (DEGREES_OF_AGREEMENT+1.0))/DEGREES_OF_AGREEMENT * (question.reversed ? -1 : 1);
            totalTraitScores[measuredTrait].push(weightedAnswer);
        });

        let traitScoresWeighted = {};
        BIG_FIVE_TRAITS.traits.forEach((trait) => {
            // Get the average score for each trait
            traitScoresWeighted[trait] = 
                totalTraitScores[trait].reduce(
                    (accumulator, currentValue) => accumulator + currentValue, 0.0
                ) / totalTraitScores[trait].length;

        });
        return traitScoresWeighted;
    }

    return(
        <div>
            <h4>
                Please indicate how much you agree with the following statement:
            </h4>
            <h3>
                You see yourself as {QUESTIONS[questionIndex].displayText}.
            </h3>
            <div>
                <label>
                    <input type="range" min="1" max={(2*DEGREES_OF_AGREEMENT+1).toString()}
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}/>

                    <h4>
                        {selectedValue} 
                    </h4>
                    <h3>
                        {DEGREE_LABELS[selectedValue-1]}
                    </h3>
                </label>
            </div>

            <button onClick={prevQuestion}
            disabled={questionIndex <= 0}>
                Previous Question
            </button>

            <button onClick={nextQuestion}>
                {(questionIndex < QUESTIONS.length - 1) ? "Next Question": "Finish Quiz"}
            </button>
        </div>
    )




}