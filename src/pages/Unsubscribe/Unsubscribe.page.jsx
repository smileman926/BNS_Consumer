import React, {useState} from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import './Unsubscribe.style.scss';
import { unsubscribeEmail } from '../../utils/services/api';
import { withRouter } from 'react-router-dom';

const UnsubscribePage = withRouter(({match}) => {

    const userID = match.params.userID;

    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccss] = useState(false);
    const [isFailed, setIsFailed] = useState(false);

    const unsubcribeFunc = async (event) => {
        setIsSuccss(false);
        setIsFailed(false);
        if (loading)
            return;
        
        event.preventDefault();
        setLoading(true);
        
        unsubscribeEmail(userID)
        .then( result => {
            console.log(result);    
            if (result.message && result.message === 'success') {
                setIsSuccss(true);
            }
            else
                setIsFailed(true);
            setLoading(false);
        })
        .catch((err) => {
            err.response && console.log(err.response.data.message);
            setIsFailed(true);
            setLoading(false);
        });
        
    }

    return (        
        <Row className="unsubscribe-page">
            <Col xs={11} sm={8} md={7} lg={5}>
                <Form className="unsubscribe-form box" onSubmit={unsubcribeFunc}>
                    <h3 className="text-center font-weight-bold mb-4">You will no longer receive any emails from the website.</h3>
                    <br />
                    <Button variant="bns" type="submit" className="w-100" disabled={loading}>
                    {loading && <FontAwesomeIcon icon={faSync} className="mr-2" spin />}
                    Unsubscribe
                    </Button>
                    {isSuccess && <Alert variant="success" className="text-center">Unsubscribed Successfully</Alert>}
                    {isFailed && <Alert variant="danger" className="text-center">Unsubscribing Failed</Alert>}
                </Form>
            </Col>
        </Row>        
    )
})

export default UnsubscribePage;