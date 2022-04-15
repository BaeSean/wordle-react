import React, { useState, useRef, useEffect } from "react";
import $ from "jquery"
import 'bootstrap/dist/css/bootstrap.css';
import "../style.css"


const Wordle = () => {
    const [question, setQuestion] = useState("");
    const [wordCount, setWordCount] = useState(5);
    const [stepCount, setStepCount] = useState(2);
    const [inputArr, setInputArr] = useState(Array.from({length : wordCount*stepCount}, (n, i) => i));
    let answerArr;

    const [char, setChar] = useState('');
    const [word, setWord] = useState("");
    const [step, setStep] = useState(0);


    const [refIndex, setRefIndex] = useState(0);
    const wordInput = useRef([]);
    const nameInput = useRef();

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
        else if(refIndex%6 === 5){
            if(pressedKey !== "Enter" || pressedKey !== "Backspace"){
                console.log("이미 5글자 word임");
            }     
            
        }


        if (pressedKey === "Backspace") {
            setChar("Backspace");
            setWord(word.slice(0, -1));

            if (refIndex > 0 && word.length !== 0 ) {
                // if(refIndex <= wordCount*stepCount-1)
                wordInput.current[refIndex - 1].focus() // Front focus move
                setRefIndex(refIndex - 1);
            }
        }
        else if (pressedKey === "Enter") {
            isCorret();
            // nameInput.current.blur();
        }
        else if((65 <= pressedKeyCode && pressedKeyCode <= 90) || (97 <= pressedKeyCode && pressedKeyCode <= 122)){
            if(!is5word){
                setChar(pressedKey);
                setWord(word + pressedKey)
            }
            else{
                setChar(pressedKey);
                wordInput.current[refIndex-1].focus()

            }
        }
        

    }

    const isCorret = () => {
        if (word === question) {
            console.log("정답");
            nameInput.current.focus();
        }
        else if (word.length < wordCount) {
            console.log("5글자 단어 필요");
        }
        else {
            console.log("XXX");
            checkAnswer();

            if (step >= stepCount-1){
                console.log("종료")
                nameInput.current.focus();
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


    const handleTagColor = () => {
        
    }


    useEffect(() => {
        setQuestion("qwert");
        wordInput.current[refIndex].focus();

        console.log("init")
    }, []);

    useEffect(() => {
        console.log(step, char, word, refIndex);
        wordInput.current[refIndex].focus();

    }, [step, refIndex])


    return (
        <div onClick={onFocus}> {/* 클릭 방지 (Focus 고정) */}
            <h1>Wordle</h1>

            {/* <div>
                <input type="text" className="wordInput" maxLength="1" onKeyDown={handleKeyDown} ref={el => (wordInput.current[0] = el)} />
                <input type="text" className="wordInput" maxLength="1" onKeyDown={handleKeyDown} ref={el => (wordInput.current[1] = el)} />
                <input type="text" className="wordInput" maxLength="1" onKeyDown={handleKeyDown} ref={el => (wordInput.current[2] = el)} />
                <input type="text" className="wordInput" maxLength="1" onKeyDown={handleKeyDown} ref={el => (wordInput.current[3] = el)} />
                <input type="text" className="wordInput" maxLength="1" onKeyDown={handleKeyDown} ref={el => (wordInput.current[4] = el)} />
            </div> */}

            {
                inputArr.map((a, index) => {
                    let n = parseInt(a);
                    return (
                        <>
                            { (n%5 > 0 && n !== 0) ? null : <p/> }
                            <input key={index} type="text" className="wordInput" maxLength="1" onKeyDown={handleKeyDown} ref={el => (wordInput.current[n] = el)} />
                        </>
                    )
                })
            }
            <input type="hidden" maxLength="1" onKeyDown={handleKeyDown} ref={el => (wordInput.current[wordCount*stepCount] = el)} />


            <div>
                <button className="q" class="btn btn-secondary">Q</button>
                <button className="w" class="btn btn-secondary">W</button>
                <button className="e" class="btn btn-secondary">E</button>
                <button className="r" class="btn btn-secondary">R</button>
                <button className="t" class="btn btn-secondary">T</button>
                <button className="y" class="btn btn-secondary">Y</button>
                <button className="u" class="btn btn-secondary">U</button>
                <button className="i" class="btn btn-secondary">I</button>
                <button className="o" class="btn btn-secondary">O</button>
                <button className="p" class="btn btn-secondary">P</button>
                <button className="back" class="btn btn-secondary">⏪</button> <br />
                <button className="a" class="btn btn-secondary">A</button>
                <button className="s" class="btn btn-secondary">S</button>
                <button className="d" class="btn btn-secondary">D</button>
                <button className="f" class="btn btn-secondary">F</button>
                <button className="g" class="btn btn-secondary">G</button>
                <button className="h" class="btn btn-secondary">H</button>
                <button className="j" class="btn btn-secondary">J</button>
                <button className="k" class="btn btn-secondary">K</button>
                <button className="l" class="btn btn-secondary">L</button>
                <button className="enter" class="btn btn-secondary">Enter</button> <br />
                <button className="z" class="btn btn-secondary">Z</button>
                <button className="x" class="btn btn-secondary">X</button>
                <button className="c" class="btn btn-secondary">C</button>
                <button className="v" class="btn btn-secondary">V</button>
                <button className="b" class="btn btn-secondary">B</button>
                <button className="n" class="btn btn-secondary">N</button>
                <button className="m" class="btn btn-secondary">M</button>
            </div>

            <input type="text"  placeholder="Your name!" ref={nameInput} />

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