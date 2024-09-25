import styled from "styled-components";
import { Button } from "reactstrap";


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
    background-color: transparent;
    border-color: transparent;
    &:hover{
        background-color: transparent;
        border-color: transparent;
        color: var(--danger);
    }
`