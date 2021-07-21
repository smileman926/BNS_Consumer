import React, { Fragment } from 'react';
import { Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

const PoliciesPage = () => {

    return (
        <Container>
            <Helmet>
                {/* <!-- HTML Meta Tags --> */}
                <title>Policies</title>
                <link rel="canonical" href={window.location.href} />
                <meta
                name="description"
                content="Policies of The BM Revolution"
                />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemprop="name" content="Policies" />
                <meta
                itemprop="description"
                content="Policies of The BM Revolution"
                />
            
                {/* <!-- Facebook Meta Tags --> */}
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Policies" />
                <meta
                property="og:description"
                content="Policies of The BM Revolution"
                />

                {/* <!-- Twitter Meta Tags --> */}
                {/* <meta name="twitter:card" content="summary_large_image" /> */}
                <meta name="twitter:title" content="Policies" />
                <meta
                name="twitter:description"
                content="Policies of The BM Revolution"
                />
            </Helmet>
            <h2 className="text-white font-weight-bold text-center mt-0 ml-0 mb-4">Policies</h2>
            <hr style={{color: 'darkgrey'}}/>
            <h4 className="text-white mb-0">Privacy Policy</h4>
            <p style={{color: "#a3a3a3"}}>We respect and are committed to protecting your privacy. We may collect personally identifiable information when you visit our site. We also automatically receive and record information on our server logs from your browser including your IP address, cookie information, and the page(s) you visited. We will not sell your personally identifiable information to anyone.</p>
            <br/>
            <h4 className="text-white mb-0">Security Policy</h4>
            <p style={{color: "#a3a3a3"}}>Your payment and personal information is always safe. Our Secure Sockets Layer (SSL) software is the industry standard and among the best software available today for secure commerce transactions. It encrypts all of your personal information, including credit card number, name, and address, so that it cannot be read over the internet.</p>
            <br/>
            <h4 className="text-white mb-0">Refund Policy</h4>
            <p style={{color: "#a3a3a3"}}>All payments are final and no refunds will be processed.</p>
            <br/>
        </Container>
    )
}

export default PoliciesPage;