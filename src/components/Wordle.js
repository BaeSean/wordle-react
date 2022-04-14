import React, { useState, useRef, useEffect } from "react";
import $ from "jquery"

const Wordle = () => {
    const [question, setQuestion] = useState("");
    const [wordCount, setWordCount] = useState(5);
    const [stepCount, setStepCount] = useState(2);
    const [inputArr, setInputArr] = useState(Array.from({length : wordCount*stepCount}, (n, i) => i));
    

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
                <button className="qKey">Q</button>
                <button className="wKey">W</button>
                <button className="eKey">E</button>
                <button className="rKey">R</button>
                <button className="tKey">T</button>
                <button className="yKey">Y</button>
                <button className="uKey">U</button>
                <button className="iKey">I</button>
                <button className="oKey">O</button>
                <button className="pKey">P</button>
                <button className="backKey">⏪</button> <br />
                <button className="aKey">A</button>
                <button className="sKey">S</button>
                <button className="dKey">D</button>
                <button className="fKey">F</button>
                <button className="gKey">G</button>
                <button className="hKey">H</button>
                <button className="jKey">J</button>
                <button className="kKey">K</button>
                <button className="lKey">L</button>
                <button className="enterKey">Enter</button> <br />
                <button className="zKey">Z</button>
                <button className="xKey">X</button>
                <button className="cKey">C</button>
                <button className="vKey">V</button>
                <button className="bKey">B</button>
                <button className="nKey">N</button>
                <button className="mKey">M</button>
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