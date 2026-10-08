# Dictation Revision

Sentence revision for P.1 Dictation 3. The learner taps the listening button,
enters an answer, checks it, and advances through all six sentences in shuffled
order.

Files:
[`src/composables/useDictationGame.js`](../src/composables/useDictationGame.js),
[`src/utils/dictation.js`](../src/utils/dictation.js), and
[`src/components/DictationGameScreen.vue`](../src/components/DictationGameScreen.vue).

## Levels

| Level | Input |
| --- | --- |
| Normal | The sentence is shown with colour, number, and object words blanked. |
| Hard | Only audio is provided; the learner types the complete sentence. |

Both levels call `speak(sentence, 'en')` through the browser's built-in speech
synthesis. Playback can be repeated without a limit.

## Sentence set

1. I like the red and black plane.
2. The trains are yellow and green.
3. It is orange and purple.
4. I have two robots.
5. I have a gun and a doll.
6. They are pink and white.

`DICTATION_SENTENCES` stores each sentence with its Normal-level keywords.
`shuffleSentences()` changes their order at the start of every round.

## Grading

`normalizeDictationText()` lowercases input, removes `. , ! ?`, collapses
whitespace, and trims it. Grading therefore ignores capitalization, final
punctuation, and extra spaces while still requiring the correct words and word
order.

Normal mode compares each field with its corresponding keyword. Hard mode
compares the normalized complete sentence. Each sentence is worth one point;
the shared streak, accuracy, timer, feedback, and results conventions apply.
