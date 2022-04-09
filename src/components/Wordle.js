import React, {useState} from "react";

const Wordle = () => {
    const [char, setChar] = useState('');
    const [word, setWord] = useState("");

    
    const onChange = (e) => {
        if(/[a-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g.test(this.value)){ //한글 막기
            e.preventDefault();
            this.value = "";
        }else if (e.which != 8 && e.which != 0 //영문 e막기
            && e.which < 48 || e.which > 57    //숫자키만 받기
            && e.which < 96 || e.which > 105){ //텐키 받기
            e.preventDefault();
            this.value = "";
        }
    }

    const handleKeyDown = (event) => {
        if(event.key === "Backspace"){
            setChar("Backspace");
            setWord(word.slice(0, -1));
        }
        else if(event.key === "Q" || event.key === "q"){
            setChar("q");
            setWord(word + "q")
        }
        else if(event.key === "W" || event.key === "w"){
            setChar("w");
            setWord(word + "w")
        }
        else if(event.key === "E" || event.key === "e"){
            setChar("e");
            setWord(word + "e")
        }
        else if(event.key === "R" || event.key === "r"){
            setChar("r");
            setWord(word + "r")
        }
        else if(event.key === "T" || event.key === "t"){
            setChar("t");
            setWord(word + "t")
        }
        else if(event.key === "Y" || event.key === "y"){
            setChar("y");
            setWord(word + "y")
        }
        else if(event.key === "U" || event.key === "u"){
            setChar("u");
            setWord(word + "u")
        }
        else if(event.key === "I" || event.key === "i"){
            setChar("i");
            setWord(word + "i")
        }
        else if(event.key === "O" || event.key === "o"){
            setChar("o");
            setWord(word + "o")
        }
        else if(event.key === "P" || event.key === "p"){
            setChar("p");
            setWord(word + "p")
        }
        else if(event.key === "A" || event.key === "a"){
            setChar("a");
            setWord(word + "a")
        }


        else if(event.key === "Endter"){
            console.log(char, word);
        }

        console.log(word);
    }


    return (
      <>
      <h1>Wordle</h1>


        <div>
        <input type="text" className="wordInput" maxLength="1" onKeyDown={handleKeyDown} />
        <input type="text" className="wordInput" maxLength="1" />

        </div>

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
            <button className="backKey">[[</button> <br/>
            <button className="aKey">A</button>
            <button className="sKey">S</button>
            <button className="dKey">D</button>
            <button className="fKey">F</button>
            <button className="gKey">G</button>
            <button className="hKey">H</button>
            <button className="jKey">J</button>
            <button className="kKey">K</button>
            <button className="lKey">L</button>
            <button className="enterKey">Enter</button> <br/>
            <button className="zKey">Z</button>
            <button className="xKey">X</button>
            <button className="cKey">C</button>
            <button className="vKey">V</button>
            <button className="bKey">B</button>
            <button className="nKey">N</button>
            <button className="mKey">M</button>

        </div>
      </>
    );
  }
  
  export default Wordle;
  