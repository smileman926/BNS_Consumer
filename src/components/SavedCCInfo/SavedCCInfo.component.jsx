import React, { useState, useEffect, useMemo } from 'react';
import { Button, Form, Modal, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './SavedCCInfo.style.scss';

const { REACT_APP_ACCEPT_CLIENT_KEY, REACT_APP_ACCEPT_API_LOGIN_ID } = process.env;

const SavedCCInfo = ({ update, profileInfo, isSaved, setShowErr }) => {

    const [modalShow, setModalShow] = useState(false);

    const isLoading = useSelector((state) => state.updateUser.isLoaded);
    const isEnded = useSelector((state) => state.updateUser.isEnded);
    const hasErr = useSelector((state) => state.updateUser.err);

    useEffect(() => {
        hasErr && setShowErr(true);
        isEnded && !hasErr && setModalShow(false)
    }, [isEnded, hasErr]);

    const [fields, setFields] = useState({
        card: "",
        month: "month",
        year: "year",
        cvc: "",
    });

    const sendPaymentDataToAnet = () => {
        const authData = {};
        authData.clientKey = REACT_APP_ACCEPT_CLIENT_KEY;
        authData.apiLoginID = REACT_APP_ACCEPT_API_LOGIN_ID;
    
        const cardData = {};
        cardData.cardNumber = fields.card.replace(/\s/g, "");
        cardData.month = fields.month;
        cardData.year = fields.year;
        cardData.cardCode = fields.cvc;
    
        const secureData = {};
        secureData.authData = authData;
        secureData.cardData = cardData;
    
        return new Promise((resolve, reject) => {
          window.Accept.dispatchData(secureData, (res) => {
            if (res.messages.resultCode === "Error") return reject(res);
            resolve(res);
          });
        });
      };

    const handlerCard = ({ target }) => {
        const value = target.value ? target.value.replace(/[\sa-zA-z]/g, "").trim() : "";
        const card = value
          ? value
              .match(/.{1,4}/g)
              .join(" ")
              .substr(0, 19)
          : "";
        setFields({ ...fields, card });
      };

    const handlerSelect = ({ target }) => {
        setFields({ ...fields, [target.dataset.type]: target.value });
    };

    const handlerCVC = ({ target }) => {
        if (target.value.length > 3) return;
        setFields({ ...fields, cvc: target.value.replace(/\D/g, "") });
    };

    const yearConvert = (num) => {
        const currentYear = new Date();
        currentYear.setFullYear(currentYear.getFullYear() + num);

        const short = currentYear.toLocaleDateString("en", { year: "2-digit" });

        return { short, long: currentYear.getFullYear() };
    };

    const changeCCFunc = async () => {
      
        const { opaqueData } = await sendPaymentDataToAnet();        
        const body = profileInfo;
        body.opaqueData = opaqueData;
        update(body);       
    }

    const submitDisabled = useMemo(
        () => {          
            return (
              fields.card.length < 18 ||
              fields.month === "month" ||
              ((Number(fields.year) === new Date().getFullYear() - 2000) && (Number(fields.month) < new Date().getMonth() + 1)) ||
              !fields.month ||
              fields.year === "year" ||
              !fields.year ||
              fields.cvc.length < 3
            )
        }
        ,
        [fields]
      );

    return(
        <div className="cc-wrapper">
            <span style={{color: isSaved ? 'white' : 'grey'}}>{ isSaved ? isSaved : 'Save Credit Card...'}</span>
            <div className="changeBtn" onClick={()=>setModalShow(!modalShow)}>{ isSaved ? 'Change' : 'Add'}</div>
            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="md"
                centered
            >                
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label className="pl-4">Card Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Credit card"
                                value={fields.card}
                                onChange={handlerCard}
                            />
                        </Form.Group>
                        <Form.Row>
                            <Form.Group as={Col} sm={8}>
                                <Form.Label className="select_label">Expiration Date</Form.Label>

                                <div className="select_wrp">
                                <Form.Control
                                    as="select"
                                    className="select"
                                    value={fields.month}
                                    onChange={handlerSelect}                     
                                    data-type="month"
                                >
                                    <option disabled hidden value="month">
                                    Month
                                    </option>
                                    <option value="01"> January</option>
                                    <option value="02"> February</option>
                                    <option value="03"> March</option>
                                    <option value="04"> April</option>
                                    <option value="05"> May</option>
                                    <option value="06"> June</option>
                                    <option value="07"> July</option>
                                    <option value="08"> August</option>
                                    <option value="09"> September</option>
                                    <option value="10"> October</option>
                                    <option value="11"> November</option>
                                    <option value="12"> December</option>
                                </Form.Control>
                                </div>

                                <div className="select_wrp">
                                <Form.Control
                                    as="select"
                                    value={fields.year}
                                    className="select"
                                    onChange={handlerSelect}                                  
                                    data-type="year"
                                    // defaultValue="year"
                                >
                                    <option disabled hidden value="year">
                                    Year
                                    </option>
                                    <option value={yearConvert(0).short}>{yearConvert(0).long}</option>
                                    <option value={yearConvert(1).short}>{yearConvert(1).long}</option>
                                    <option value={yearConvert(2).short}>{yearConvert(2).long}</option>
                                    <option value={yearConvert(3).short}>{yearConvert(3).long}</option>
                                    <option value={yearConvert(4).short}>{yearConvert(4).long}</option>
                                    <option value={yearConvert(5).short}>{yearConvert(5).long}</option>
                                    <option value={yearConvert(6).short}>{yearConvert(6).long}</option>
                                </Form.Control>
                                </div>
                            </Form.Group>

                            <Form.Group as={Col} sn={3} controlId="formGridZip">
                                <Form.Label>CVC</Form.Label>
                                <Form.Control
                                value={fields.cvc}
                                onChange={handlerCVC}                       
                                placeholder="Three Digits"
                                type="text"
                                />
                            </Form.Group>
                        </Form.Row>
                    </Form>
              
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" disabled={submitDisabled || isLoading} onClick={changeCCFunc}>
                    {
                        isLoading && <FontAwesomeIcon icon={faSync} className="mr-2" spin />
                    } 
                        SAVE
                    </Button>
                    <Button variant="secondary" disabled={isLoading} onClick={() => setModalShow(false)}>Cancel</Button>                                                            
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default SavedCCInfo;