import React, { useState, useRef, useEffect } from "react";
import $ from "jquery"
import axios from "axios";

import Modal from "./Modal.js";
import 'bootstrap/dist/css/bootstrap.css';
import "../style/Wordle.css"


const Wordle = () => {
    //base data
    const [question, setQuestion] = useState("");
    const [wordCount, setWordCount] = useState(5);
    const [stepCount, setStepCount] = useState(5);
    const [inputArr, setInputArr] = useState(Array.from({ length: wordCount * stepCount }, (n, i) => i));
    const [answerArr, setAnswerArr] = useState(new Array(wordCount));

    //question data
    const [char, setChar] = useState('');
    const [word, setWord] = useState("");
    const [step, setStep] = useState(0);
    let inputStyle = { backgroundColor: "#707070", transform: "" };
    let buttonStyle = { backgroundColor: "#808384", };

    //ref data
    const [refIndex, setRefIndex] = useState(0);
    const wordInput = useRef([]);
    const nameInput = useRef();
    const [endGame, setEndGame] = useState(false);

    //Modal state
    const [modalOpen, setModalOpen] = useState(false);


    const onChange = (e) => {
        e.target.value = e.target.value.replace(/[^A-Za-z]/ig, '');
    }
    const onFocus = () => {
        if (endGame)
            nameInput.current.focus();
        else
            wordInput.current[refIndex].focus();
    }
    const onFocusBack = () => {
        if (endGame)
            nameInput.current.focus();
        else {
            if (refIndex === 0)
                setTimeout(() => { wordInput.current[0].focus(); }, 0.1);
            //front의 focus가 안바껴서 timeout 사용...
            else
                wordInput.current[refIndex - 1].focus();
        }
    }

    const onReset = () => {
        setEndGame(false);
        setInputArr(Array.from({ length: wordCount * stepCount }, (n, i) => i))
        setAnswerArr(new Array(wordCount));
        setStep(0);
        setRefIndex(0);
        setWord("");
        $("#nameInput").val("");
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
                if (pressedKeyCodeSum === 215)  //Press TAB
                    onFocusBack();

                handleToast(-1);
                return;
            }
        }

        //Alphabet 입력 시
        if (pressedKey !== "BACKSPACE" && pressedKey !== "ENTER" && !is5word) {
            if (refIndex < wordCount * stepCount)
                setRefIndex(refIndex + 1)
        }
        else if (refIndex % wordCount === 0 && refIndex !== 0) {
            if (pressedKey !== "ENTER" && pressedKey !== "BACKSPACE") {
                console.log("이미 " + wordCount + "글자 word임");
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
    const handleTagColor = async () => {
        const timer = ms => new Promise(res => setTimeout(res, ms));
        //각 Input의 animation을 위해
        for (let index = 0; index < answerArr.length; index++) {
            let inputIndex = step * wordCount + index;
            const strike = "#538d4e";
            const ball = "#b49f3a"
            const out = "#3a3a3c"
            const rotate = "rotateY(360deg)";

            let key = $("#input" + inputIndex).val();
            let targetColor = rgbToHex($("#" + key).css("backgroundColor"));

            if (answerArr[index] === 2) { //strike
                inputStyle = { backgroundColor: strike, transform: rotate };
                buttonStyle = { backgroundColor: strike };
            }
            else if (answerArr[index] === 1) { //ball
                inputStyle = { backgroundColor: ball, transform: rotate };
                if (targetColor !== strike)
                    buttonStyle = { backgroundColor: ball };
                else
                    buttonStyle = { backgroundColor: targetColor };
            }
            else if (answerArr[index] === 0) { //out
                inputStyle = { backgroundColor: out, transform: rotate };
                if (targetColor !== strike || targetColor !== ball)
                    buttonStyle = { backgroundColor: out };
                else
                    buttonStyle = { backgroundColor: targetColor };
            }
            // console.log(answerArr)
            //Input tag Color
            $("#input" + inputIndex).css(inputStyle);
            //Button tag color
            $("#" + key).css(buttonStyle);
            await timer(100);
        }

        // answerArr.map(async(color, index) => {
        //     let inputIndex = step * wordCount + index;
        //     const strike = "#538d4e";
        //     const ball = "#b49f3a"
        //     const out = "#3a3a3c"
        //     const rotate = "rotateY(360deg)";

        //     let key = $("#input" + inputIndex).val();
        //     let targetColor = rgbToHex($("#" + key).css("backgroundColor"));

        //     if (color === 2) { //strike
        //         inputStyle = { backgroundColor: strike, transform: rotate};
        //         buttonStyle = { backgroundColor: strike };
        //     }
        //     else if (color === 1) { //ball
        //         inputStyle = { backgroundColor: ball, transform: rotate };
        //         if (targetColor !== strike)
        //             buttonStyle = { backgroundColor: ball };
        //         else
        //             buttonStyle = { backgroundColor: targetColor };
        //     }
        //     else if (color === 0) { //out
        //         inputStyle = { backgroundColor: out, transform: rotate };
        //         if (targetColor !== strike || targetColor !== ball)
        //             buttonStyle = { backgroundColor: out };
        //         else
        //             buttonStyle = { backgroundColor: targetColor };
        //     }

        //     //Input tag Color
        //     $("#input" + inputIndex).css(inputStyle);
        //     //Button tag color
        //     $("#" + key).css(buttonStyle);
        // })
    }

    const handleToast = (errCode) => {
        if (errCode === 0) {
            $("#incorrect").fadeIn(300);
            setTimeout(() => {
                $("#incorrect").fadeOut(300);
            }, 1000)
        }
        else if (errCode === 1) {
            $("#notWord").fadeIn(300);
            setTimeout(() => {
                $("#notWord").fadeOut(300);
            }, 1000)
        }
        else if (errCode === 2) {
            $("#less5Word").fadeIn(300);
            setTimeout(() => {
                $("#less5Word").fadeOut(300);
            }, 1000)
        }
        else if (errCode === 3) {
            $("#correct").fadeIn(300);
            setTimeout(() => {
                $("#correct").fadeOut(300);
            }, 1000)
        }
        else if (errCode === -1) {
            $("#notEnglish").fadeIn(300);
            setTimeout(() => {
                $("#notEnglish").fadeOut(300);
            }, 1000)
        }
    }

    //After game end
    const gameEnded = () => {
        nameInput.current.focus();
        setEndGame(true);

        $("#nameInput").val(question);
    }

    //answer === question ?
    const isCorret = async () => {
        if (word === question) {
            console.log("정답");
            handleToast(3);
            checkAnswer();
            handleTagColor();
            gameEnded();
        }
        else if (word.length < wordCount) {
            handleToast(2);
            console.log(wordCount + "글자 단어 필요");
        }
        else {
            let wordCheck = await isWordInDic();

            if (wordCheck) {
                console.log("오답");
                handleToast(0);
                checkAnswer();
                handleTagColor();

                if (step >= stepCount - 1) {
                    console.log("종료")
                    gameEnded();
                }
                else {
                    setStep(step + 1);
                    setWord("");
                }
            }
            else {
                console.log("단어가 아님!")
                handleToast(1);
            }
        }
    }


    const checkAnswer = () => {
        //strike 
        let tempArr = answerArr;

        for (let i = 0; i < wordCount; i++) {
            if (word[i] === question[i]) {
                tempArr[i] = 2;
            }
        }
        //out 체크
        for (let i = 0; i < wordCount; i++) {
            if (tempArr[i] !== 2) {
                let isOut = true;

                for (let j = 0; j < wordCount; j++) {
                    if (word[i] === question[j] && i !== j & tempArr[j] !== 2) {
                        isOut = false;
                    }
                }

                if (isOut) {
                    tempArr[i] = 0;
                }
            }
        }
        //ball 체크
        for (let i = 0; i < wordCount; i++) {
            if (!(tempArr[i] >= 0)) {
                tempArr[i] = 1;
            }
        }

        setAnswerArr(new Array(tempArr));
    }


    const generateQuestion = async () => {
        //http://random-word-api.herokuapp.com/home
        try {
            let dicWord = await axios.get('https://random-word-api.herokuapp.com/word?length=' + wordCount)
            setQuestion(dicWord.data[0].toUpperCase())
        }
        catch (error) {
            console.log(error)
        }
    }

    const isWordInDic = async () => {
        try {
            await axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + word)
            return true;
        } catch (err) {
            return false;
        }
    }


    
    //init && Change Setting
    useEffect(() => {
        onReset();

        inputArr.map((n, i) => {
            $("#input" + n).css(inputStyle);
            $("#input" + n).val("");
        })
        $(".buttonGroup button").css(buttonStyle);

        wordInput.current[0].focus();

        generateQuestion();
    }, [wordCount, stepCount]);

    //정답 알려주기
    useEffect(() => {
        console.log(question)
    }, [question])

    useEffect(() => {
        // console.log(step, char, word, refIndex);
        // wordInput.current[refIndex].focus();
    }, [step, refIndex])


    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    };

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
        <>
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
                                    <input key={index} onInput={onChange} style={inputStyle} id={inputId} type="text" className="wordInput" maxLength="1" onKeyDown={handleKeyDown} inputmode="none" ref={el => (wordInput.current[n] = el)} />
                                </>
                            )
                        })
                    }
                    <input type="hidden" maxLength="1" onKeyDown={handleKeyDown} ref={el => (wordInput.current[wordCount * stepCount] = el)} />
                </div>


                <div className="buttonGroup">
                    <button id="Q" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">Q</button>
                    <button id="W" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">W</button>
                    <button id="E" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">E</button>
                    <button id="R" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">R</button>
                    <button id="T" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">T</button>
                    <button id="Y" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">Y</button>
                    <button id="U" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">U</button>
                    <button id="I" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">I</button>
                    <button id="O" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">O</button>
                    <button id="P" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">P</button>
                    <button id="BACKSPACE" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">🔙</button> <br />

                    <button id="A" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">A</button>
                    <button id="S" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">S</button>
                    <button id="D" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">D</button>
                    <button id="F" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">F</button>
                    <button id="G" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">G</button>
                    <button id="H" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">H</button>
                    <button id="J" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">J</button>
                    <button id="K" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">K</button>
                    <button id="L" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">L</button>
                    <button id="ENTER" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">ENTER</button> <br />

                    <button id="Z" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">Z</button>
                    <button id="X" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">X</button>
                    <button id="C" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">C</button>
                    <button id="V" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">V</button>
                    <button id="B" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">B</button>
                    <button id="N" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">N</button>
                    <button id="M" onClick={handleClick} style={buttonStyle} class="btn btn-secondary">M</button>
                </div>

                <footer>
                    <label>Answer : </label>
                    <input autocomplete="off" type="text" class="btn" id="nameInput" placeholder="？？？？？" ref={nameInput} />
                    <button type="button" class="btn btn-primary" id="modalButton" onClick={openModal}>Setting</button>
                </footer>

                <div class="myToast toast" id="less5Word">
                    Less than {wordCount} word
                </div>
                <div class="myToast toast" id="notWord">
                    This is not a Word
                </div>
                <div class="myToast toast" id="incorrect">
                    Incorrect!
                </div>
                <div class="myToast toast" id="correct">
                    CORRECT!
                </div>
                <div class="myToast toast" id="notEnglish">
                    Input only English!
                </div>

            </div>

            <Modal modalOpen={modalOpen} closeModal={closeModal} wordCount={wordCount} setWordCount={setWordCount} stepCount={stepCount} setStepCount={setStepCount} >
            </Modal>

        </>
    );
}

export default Wordle;