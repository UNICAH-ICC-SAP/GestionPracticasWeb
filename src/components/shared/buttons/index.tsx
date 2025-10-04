import React from "react";
import styled from "styled-components";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export const ButtonPrimary = styled(Button)`
    background-color: var(--bs-primary);
    border-color: var(--bs-primary);

    &:hover{
        background-color: var(--bs-secondary);
        border-color: var(--bs-secondary);
    }
`

export const ButtonSecondary = styled(Button)`
    background-color: var(--bs-secondary);
    border-color: var(--bs-secondary);

    &:hover{
        background-color: var(--bs-primary);
        border-color: var(--bs-primary);
    }
`

export const ButtonDanger = styled(Button)`
    background-color: var(--bs-danger);
    border-color: var(--bs-danger);

    &:hover{
        background-color: var(--danger-shadow);
        border-color: var(--danger-shadow);
    }
`
export const ButtonTransparent = styled(Button)`
    width: auto;
    background-color: transparent;
    border-color: transparent;
    &:hover{
        background-color: transparent;
        border-color: transparent;
        color: var(--danger);
    }
`

export function WhatsappButton({ telefono }: { telefono: string }) {
    const newPhone = telefono.includes('504') ? telefono : `504${telefono}`;
    return <a className="btn btn-success w-50" style={{ color: 'white' }} href={`https://wa.me/${newPhone}`} target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faWhatsapp} /> </a>
}