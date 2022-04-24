import React, { useEffect, useState } from 'react';
import $ from "jquery"
import "../modal.css"

const Modal = (props) => {
    // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
    const { modalOpen, closeModal, wordCount, setWordCount, stepCount, setStepCount } = props;

    const [selected, setSelected] = useState([])

    const changeProps = () => {
        setWordCount(parseInt($("#wordSelect option:selected").val()));
        setStepCount(parseInt($("#stepSelect option:selected").val()));
        closeModal();
    }

    useEffect(() => {
        setSelected([wordCount, stepCount]);

        $('#wordSelect').val(selected[0]).prop("selected", true);
        $('#stepSelect').val(selected[1]).prop("selected", true);
    }, [modalOpen])

    return (
        // 모달이 열릴때 openModal 클래스가 생성된다.
        <div className={modalOpen ? 'openModal modal' : 'modal'}>
            {modalOpen ? (
                <section>
                    <header>
                        Change Word length & Step
                        {/* <button className="close" onClick={close}>
              &times;
            </button> */}
                    </header>
                    <main>
                        <div class="form row">
                            <div class="col">
                                <div class="form-floating">
                                    <select class="form-select" id="wordSelect" aria-label="Floating label select example">
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                    </select>
                                    <label for="wordSelect">Word length</label>
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-floating">
                                    <select class="form-select" id="stepSelect" aria-label="Floating label select example">
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                    </select>
                                    <label for="stepSelect">Step</label>
                                </div>
                            </div>
                        </div>
                    </main>
                    <footer>
                        <button className="accept" onClick={changeProps}>Accept</button>
                        <button className="close" onClick={closeModal}>close</button>
                    </footer>
                </section>
            ) : null}
        </div>
    );
};

export default Modal;