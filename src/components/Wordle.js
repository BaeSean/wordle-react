import React, { useState, useRef, useEffect } from "react";
import $ from "jquery"
import 'bootstrap/dist/css/bootstrap.css';
import "../style.css"


const Wordle = () => {
    //base data
    const [question, setQuestion] = useState("");
    const [wordCount, setWordCount] = useState(5);
    const [stepCount, setStepCount] = useState(3);
    const [inputArr, setInputArr] = useState(Array.from({ length: wordCount * stepCount }, (n, i) => i));
    let answerArr;

    //question data
    const [char, setChar] = useState('');
    const [word, setWord] = useState("");
    const [step, setStep] = useState(0);
    let inputColor = { backgroundColor: "#707070", };
    let buttonColor = { backgroundColor: "#808384", };

    //ref data
    const [refIndex, setRefIndex] = useState(0);
    const wordInput = useRef([]);
    const nameInput = useRef();
    let endGame = false;


    const onChange = (e) => {
        e.target.value = e.target.value.replace(/[^A-Za-z]/ig, '');
    }

    const onFocus = () => {
        if (endGame)
            nameInput.current.focus();
        else
            wordInput.current[refIndex].focus();
    }
    const onFocus_1 = () => {
        if (endGame)
            nameInput.current.focus();
        else {
            if (refIndex === 0)
                setTimeout(function () { wordInput.current[0].focus(); }, 0.1);
                //front의 focus가 안바껴서 timeout 사용...
            else
                wordInput.current[refIndex - 1].focus();
        }
    }

    const onReset = () => {
        setWord("");
    }

    //Pysical keyboard press
    const handleKeyDown = (event) => {
        const pressedKey = event.key.toUpperCase();
        const pressedKeyCode = pressedKey.charCodeAt(0)
        let is5word = false;

        if (word.length === wordCount)
            is5word = true;

        //Alphabet + Enter + Backspace 이외 입력 막기
        let pressedKeyCodeSum = 0;
        for (let i = 0; i < pressedKey.length; i++) {
            pressedKeyCodeSum = pressedKeyCodeSum + pressedKey[i].charCodeAt(0);
        }
        if (90 < pressedKeyCodeSum || pressedKeyCodeSum < 65) {
            if (pressedKey !== "BACKSPACE" && pressedKey !== "ENTER") {
                onFocus();

                if (pressedKeyCodeSum === 215)
                    onFocus_1();

                return;
            }
        }

        //Alphabet 입력 시
        if (pressedKey !== "BACKSPACE" && pressedKey !== "ENTER" && !is5word) {
            if (refIndex < wordCount * stepCount)
                setRefIndex(refIndex + 1)
        }
        else if (refIndex % 5 === 0 && refIndex !== 0) {
            if (pressedKey !== "ENTER" && pressedKey !== "BACKSPACE") {
                console.log("이미 5글자 word임");
            }
        }


        if (pressedKey === "BACKSPACE") {
            setChar("BACKSPACE");
            setWord(word.slice(0, -1));

            if (refIndex > 0 && word.length !== 0) {
                wordInput.current[refIndex - 1].focus() // Front focus move
                setRefIndex(refIndex - 1);

                //click시 input value 삭제필요 (동기화가 안되서 사용)
                const inputIndex = refIndex - 1;
                $("#input" + inputIndex).val("");

            }

        }
        else if (pressedKey === "ENTER") {
            isCorret();
            // nameInput.current.blur();
        }
        else if ((65 <= pressedKeyCode && pressedKeyCode <= 90)) {
            if (!is5word) {
                setChar(pressedKey);
                setWord(word + pressedKey);
                $("#input" + refIndex).val(pressedKey);
            }
            else {
                setChar(pressedKey);
                wordInput.current[refIndex - 1].focus();
            }
        }
    }

//Keyboard button click
    const handleClick = (event) => {
        event.preventDefault();
        const clickedBtn = { key: event.target.id }

        if (endGame) {
            //Front Input 변경
            let text = $("#nameInput").val();

            if (clickedBtn.key === "BACKSPACE")
                text = text.slice(0, -1);
            else if (clickedBtn.key !== "ENTER")
                text = text + clickedBtn.key;

            $("#nameInput").val(text);

            return;
        }
        else {
            handleKeyDown(clickedBtn);
        }
    }

//input + button tag color change
    const handleTagColor = () => {
        answerArr.map((color, index) => {
            let inputIndex = step * wordCount + index;
            const strike = "#538d4e";
            const ball = "#b49f3a"
            const out = "#3a3a3c"

            let key = $("#input" + inputIndex).val();
            let targetColor = rgbToHex($("#" + key).css("backgroundColor"));


            if (color === 2) { //strike
                inputColor = { backgroundColor: strike };
                buttonColor = { backgroundColor: strike };
            }
            else if (color === 1) { //ball
                inputColor = { backgroundColor: ball };
                if (targetColor !== strike)
                    buttonColor = { backgroundColor: ball };
                else
                    buttonColor = { backgroundColor: targetColor };
            }
            else if (color === 0) { //out
                inputColor = { backgroundColor: out };
                if (targetColor !== strike || targetColor !== ball)
                    buttonColor = { backgroundColor: out };
                else
                    buttonColor = { backgroundColor: targetColor };
            }

            //Input tag Color
            $("#input" + inputIndex).css(inputColor);
            //Button tag color
            $("#" + key).css(buttonColor);
        })
    }


    const handleEndGame = () => {
        nameInput.current.focus();
        endGame = true;

        $("#nameInput").val(question);
    }


    const isCorret = () => {
        if (word === question) {
            console.log("정답");
            checkAnswer();
            handleTagColor();
            handleEndGame();
        }
        else if (word.length < wordCount) {
            console.log("5글자 단어 필요");
        }
        else {
            console.log("XXX");
            checkAnswer();
            handleTagColor();

            if (step >= stepCount - 1) {
                console.log("종료")
                handleEndGame();
            }
            else {
                setStep(step + 1);
                onReset();
            }
        }
    }


    const checkAnswer = () => {
        answerArr = new Array(wordCount);

        //strike 체크
        for (let i = 0; i < wordCount; i++) {
            if (word[i] === question[i]) {
                answerArr[i] = 2;
            }
        }

        //out 체크
        for (let i = 0; i < wordCount; i++) {
            if (answerArr[i] !== 2) {
                let isOut = true;

                for (let j = 0; j < wordCount; j++) {
                    if (word[i] === question[j] && i !== j & answerArr[j] !== 2) {
                        isOut = false;
                    }
                }

                if (isOut) {
                    answerArr[i] = 0;
                }
            }
        }

        //ball 체크
        for (let i = 0; i < wordCount; i++) {
            if (!(answerArr[i] >= 0)) {
                answerArr[i] = 1;
            }
        }
        console.log(answerArr);
    }


    useEffect(() => {
        setQuestion("UUUQQ");
        wordInput.current[refIndex].focus();

        console.log("init")
    }, []);

    useEffect(() => {
        console.log(step, char, word, refIndex);
        wordInput.current[refIndex].focus();

    }, [step, refIndex])

//rgb to hexCode
    const rgbToHex = (rgbType) => {
        var rgb = rgbType.replace(/[^%,.\d]/g, "").split(",");

        rgb.forEach(function (str, x, arr) {

            /* 컬러값이 "%"일 경우, 변환하기. */
            if (str.indexOf("%") > -1) str = Math.round(parseFloat(str) * 2.55);

            /* 16진수 문자로 변환하기. */
            str = parseInt(str, 10).toString(16);
            if (str.length === 1) str = "0" + str;

            arr[x] = str;
        });

        return "#" + rgb.join("");
    }

    return (
        <div className="main" onClick={onFocus}> {/* 클릭 방지 (Focus 고정) */}
            <div>
                <h1>Wordle</h1>
            </div>


            <div>
                {
                    inputArr.map((a, index) => {
                        let n = parseInt(a);
                        let inputId = "input" + n

                        return (
                            <>
                                {(n % wordCount > 0 && n !== 0) ? null : <p />}
                                <input onInput={onChange} style={inputColor} key={index} id={inputId} type="text" className="wordInput" maxLength="1" onKeyDown={handleKeyDown} ref={el => (wordInput.current[n] = el)} />
                            </>
                        )
                    })
                }
                <input type="hidden" maxLength="1" onKeyDown={handleKeyDown} ref={el => (wordInput.current[wordCount * stepCount] = el)} />
            </div>


            <div>
                <button id="Q" onClick={handleClick} style={buttonColor} class="btn btn-secondary">Q</button>
                <button id="W" onClick={handleClick} style={buttonColor} class="btn btn-secondary">W</button>
                <button id="E" onClick={handleClick} style={buttonColor} class="btn btn-secondary">E</button>
                <button id="R" onClick={handleClick} style={buttonColor} class="btn btn-secondary">R</button>
                <button id="T" onClick={handleClick} style={buttonColor} class="btn btn-secondary">T</button>
                <button id="Y" onClick={handleClick} style={buttonColor} class="btn btn-secondary">Y</button>
                <button id="U" onClick={handleClick} style={buttonColor} class="btn btn-secondary">U</button>
                <button id="I" onClick={handleClick} style={buttonColor} class="btn btn-secondary">I</button>
                <button id="O" onClick={handleClick} style={buttonColor} class="btn btn-secondary">O</button>
                <button id="P" onClick={handleClick} style={buttonColor} class="btn btn-secondary">P</button>
                <button id="BACKSPACE" onClick={handleClick} style={buttonColor} class="btn btn-secondary">🔙</button> <br />

                <button id="A" onClick={handleClick} style={buttonColor} class="btn btn-secondary">A</button>
                <button id="S" onClick={handleClick} style={buttonColor} class="btn btn-secondary">S</button>
                <button id="D" onClick={handleClick} style={buttonColor} class="btn btn-secondary">D</button>
                <button id="F" onClick={handleClick} style={buttonColor} class="btn btn-secondary">F</button>
                <button id="G" onClick={handleClick} style={buttonColor} class="btn btn-secondary">G</button>
                <button id="H" onClick={handleClick} style={buttonColor} class="btn btn-secondary">H</button>
                <button id="J" onClick={handleClick} style={buttonColor} class="btn btn-secondary">J</button>
                <button id="K" onClick={handleClick} style={buttonColor} class="btn btn-secondary">K</button>
                <button id="L" onClick={handleClick} style={buttonColor} class="btn btn-secondary">L</button>
                <button id="ENTER" onClick={handleClick} style={buttonColor} class="btn btn-secondary">ENTER</button> <br />

                <button id="Z" onClick={handleClick} style={buttonColor} class="btn btn-secondary">Z</button>
                <button id="X" onClick={handleClick} style={buttonColor} class="btn btn-secondary">X</button>
                <button id="C" onClick={handleClick} style={buttonColor} class="btn btn-secondary">C</button>
                <button id="V" onClick={handleClick} style={buttonColor} class="btn btn-secondary">V</button>
                <button id="B" onClick={handleClick} style={buttonColor} class="btn btn-secondary">B</button>
                <button id="N" onClick={handleClick} style={buttonColor} class="btn btn-secondary">N</button>
                <button id="M" onClick={handleClick} style={buttonColor} class="btn btn-secondary">M</button>
            </div>

            <input type="text" id="nameInput" placeholder="Your name!" ref={nameInput} />

        </div>
    );
}

export default Wordle;