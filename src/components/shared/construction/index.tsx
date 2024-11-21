import React from 'react'
import './construction.css'
import { Row, Label, Container} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools } from '@fortawesome/free-solid-svg-icons'; 

export default function UnderConstruction(){
    return <Container>
        <FontAwesomeIcon className="underConstruction-icon mt-5 pt-5"  icon={faTools} />
        <Row>
            <Label className="Underconstruction_text mt-2">En construcción</Label>
        </Row>
    </Container> 
}