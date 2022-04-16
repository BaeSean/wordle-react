import React, { useState, useRef, useEffect } from "react";
import $ from "jquery"
import 'bootstrap/dist/css/bootstrap.css';
import "../style.css"


const Wordle = () => {
//base data
    const [question, setQuestion] = useState("");
    const [wordCount, setWordCount] = useState(5);
    const [stepCount, setStepCount] = useState(3);
    const [inputArr, setInputArr] = useState(Array.from({length : wordCount*stepCount}, (n, i) => i));
    let answerArr;

//question data
    const [char, setChar] = useState('');
    const [word, setWord] = useState("");
    const [step, setStep] = useState(0);

//ref data
    const [refIndex, setRefIndex] = useState(0);
    const wordInput = useRef([]);
    const nameInput = useRef();
    let endGame = false;

    // const onChange = (e) => {
    //     if (/[a-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g.test(this.value)) { //한글 막기
    //         e.preventDefault();
    //         this.value = "";
    //     } else if (e.which != 8 && e.which != 0 //영문 e막기
    //         && e.which < 48 || e.which > 57    //숫자키만 받기
    //         && e.which < 96 || e.which > 105) { //텐키 받기
    //         e.preventDefault();
    //         this.value = "";
    //     }
    // }
    
    const onFocus = () => {
        if(endGame) 
            nameInput.current.focus();
        else 
            wordInput.current[refIndex].focus();
    }
    const onReset = () => {
        setWord("");
    }

    const handleKeyDown = (event) => {
        const pressedKey = event.key;
        const pressedKeyCode = pressedKey.charCodeAt(0)
        let is5word = false;

        if(word.length === 5)
            is5word = true;

        if (pressedKey !== "Backspace" && pressedKey !== "Enter" && !is5word) {//&& refIndex%6 !== 5
            if(refIndex < wordCount*stepCount)
                setRefIndex(refIndex + 1)
        }
        else if(refIndex%5 === 0){
            if(pressedKey !== "Enter" && pressedKey !== "Backspace"){
                console.log("이미 5글자 word임");
            }     
        }


        if (pressedKey === "Backspace") {
            setChar("Backspace");
            setWord(word.slice(0, -1));

            if (refIndex > 0 && word.length !== 0 ) {
                wordInput.current[refIndex - 1].focus() // Front focus move
                setRefIndex(refIndex - 1);
            }

//click시 input value 삭제필요 (동기화가 안되서 사용)
            const inputIndex = refIndex-1;
            $("#input" + inputIndex).val("");
        }
        else if (pressedKey === "Enter") {
            isCorret();
            // nameInput.current.blur();
        }
        else if((65 <= pressedKeyCode && pressedKeyCode <= 90) || (97 <= pressedKeyCode && pressedKeyCode <= 122)){
            if(!is5word){
                setChar(pressedKey);
                setWord(word + pressedKey);
                $("#input" + refIndex).val(pressedKey);
            }
            else{
                setChar(pressedKey);
                wordInput.current[refIndex-1].focus();
            }
        }
    }


    const handleClick = (event) => {
        event.preventDefault();
        const clickedBtn = {key:event.target.id}
        
        if(endGame){
            let text = $("#nameInput").val();

            if(clickedBtn.key === "Backspace")
                text = text.slice(0,-1);
            else if(clickedBtn.key !== "Enter")
                text = text + clickedBtn.key;

            $("#nameInput").val(text);
            
            return;
        } 
        else{
            handleKeyDown(clickedBtn);
        }
    }


    const handleTagColor = () => {
        answerArr.map((color, index) => {
            let inputIndex = step * wordCount * index;

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
            handleEndGame();
        }
        else if (word.length < wordCount) {
            console.log("5글자 단어 필요");
        }
        else {
            console.log("XXX");
            checkAnswer();

            if (step >= stepCount-1){
                console.log("종료")
                handleEndGame();
            }
            else{
                setStep(step+1);
                onReset();
            }
        }
    }


    const checkAnswer = () => {
        answerArr = new Array(wordCount);

        //strike 체크
        for(let i = 0; i < wordCount; i++){
            if(word[i] === question[i]){
                answerArr[i] = 2;
            }
        }
        
        //out 체크
        for(let i = 0; i < wordCount; i++){

            if(answerArr[i] !== 2){
                let isOut = true;
        
                for(let j = 0; j < wordCount; j++){
                    if(word[i] === question[j] && i !== j){
                        isOut = false;
                    }
                }

                if(isOut){
                    answerArr[i] = 0;
                }
            }
        }

        //ball 체크
        for(let i = 0; i < wordCount; i++){
            if(!(answerArr[i] >= 0)){
                answerArr[i] = 1;
            }
        }
        console.log(answerArr);
    }


    useEffect(() => {
        setQuestion("bonus");
        wordInput.current[refIndex].focus();

        console.log("init")
    }, []);

    useEffect(() => {
        console.log(step, char, word, refIndex);
        wordInput.current[refIndex].focus();

    }, [step, refIndex])


    return (
        <div className="main" onClick={onFocus}> {/* 클릭 방지 (Focus 고정) */}
            <h1>Wordle</h1>

            {/* <div>
                <input type="text" id="wordInput" maxLength="1" onKeyDown={handleKeyDown} ref={el => (wordInput.current[0] = el)} />
                <input type="text" id="wordInput" maxLength="1" onKeyDown={handleKeyDown} ref={el => (wordInput.current[1] = el)} />
                <input type="text" id="wordInput" maxLength="1" onKeyDown={handleKeyDown} ref={el => (wordInput.current[2] = el)} />
                <input type="text" id="wordInput" maxLength="1" onKeyDown={handleKeyDown} ref={el => (wordInput.current[3] = el)} />
                <input type="text" id="wordInput" maxLength="1" onKeyDown={handleKeyDown} ref={el => (wordInput.current[4] = el)} />
            </div> */}

            {
                inputArr.map((a, index) => {
                    let n = parseInt(a);
                    let inputId = "input" + n

                    return (
                        <>
                            { (n%5 > 0 && n !== 0) ? null : <p/> }
                            <input key={index} id={inputId} type="text" className="wordInput" maxLength="1" onKeyDown={handleKeyDown} ref={el => (wordInput.current[n] = el)} />
                        </>
                    )
                })
            }
            <input type="hidden" maxLength="1" onKeyDown={handleKeyDown} ref={el => (wordInput.current[wordCount*stepCount] = el)} />


            <div>
                <button id="q" onClick={handleClick} class="btn btn-secondary">Q</button>
                <button id="w" onClick={handleClick} class="btn btn-secondary">W</button>
                <button id="e" onClick={handleClick} class="btn btn-secondary">E</button>
                <button id="r" onClick={handleClick} class="btn btn-secondary">R</button>
                <button id="t" onClick={handleClick} class="btn btn-secondary">T</button>
                <button id="y" onClick={handleClick} class="btn btn-secondary">Y</button>
                <button id="u" onClick={handleClick} class="btn btn-secondary">U</button>
                <button id="i" onClick={handleClick} class="btn btn-secondary">I</button>
                <button id="o" onClick={handleClick} class="btn btn-secondary">O</button>
                <button id="p" onClick={handleClick} class="btn btn-secondary">P</button>
                <button id="Backspace" onClick={handleClick} class="btn btn-secondary">🔙</button> <br />
               
                <button id="a" onClick={handleClick} class="btn btn-secondary">A</button>
                <button id="s" onClick={handleClick} class="btn btn-secondary">S</button>
                <button id="d" onClick={handleClick} class="btn btn-secondary">D</button>
                <button id="f" onClick={handleClick} class="btn btn-secondary">F</button>
                <button id="g" onClick={handleClick} class="btn btn-secondary">G</button>
                <button id="h" onClick={handleClick} class="btn btn-secondary">H</button>
                <button id="j" onClick={handleClick} class="btn btn-secondary">J</button>
                <button id="k" onClick={handleClick} class="btn btn-secondary">K</button>
                <button id="l" onClick={handleClick} class="btn btn-secondary">L</button>
                <button id="Enter" onClick={handleClick} class="btn btn-secondary">Enter</button> <br />
                
                <button id="z" onClick={handleClick} class="btn btn-secondary">Z</button>
                <button id="x" onClick={handleClick} class="btn btn-secondary">X</button>
                <button id="c" onClick={handleClick} class="btn btn-secondary">C</button>
                <button id="v" onClick={handleClick} class="btn btn-secondary">V</button>
                <button id="b" onClick={handleClick} class="btn btn-secondary">B</button>
                <button id="n" onClick={handleClick} class="btn btn-secondary">N</button>
                <button id="m" onClick={handleClick} class="btn btn-secondary">M</button>
            </div>

            <input type="text" id="nameInput" placeholder="Your name!" ref={nameInput} />

        </div>
    );
}

export default Wordle;






// else if (event.key === "Q" || event.key === "q") {
//     setChar("q");
//     setWord(word + "q")
// }
// else if (event.key === "W" || event.key === "w") {
//     setChar("w");
//     setWord(word + "w")
// }
// else if (event.key === "E" || event.key === "e") {
//     setChar("e");
//     setWord(word + "e")
// }
// else if (event.key === "R" || event.key === "r") {
//     setChar("r");
//     setWord(word + "r")
// }
// else if (event.key === "T" || event.key === "t") {
//     setChar("t");
//     setWord(word + "t")
// }
// else if (event.key === "Y" || event.key === "y") {
//     setChar("y");
//     setWord(word + "y")
// }
// else if (event.key === "U" || event.key === "u") {
//     setChar("u");
//     setWord(word + "u")
// }
// else if (event.key === "I" || event.key === "i") {
//     setChar("i");
//     setWord(word + "i")
// }
// else if (event.key === "O" || event.key === "o") {
//     setChar("o");
//     setWord(word + "o")
// }
// else if (event.key === "P" || event.key === "p") {
//     setChar("p");
//     setWord(word + "p")
// }
// else if (event.key === "A" || event.key === "a") {
//     setChar("a");
//     setWord(word + "a")
// }