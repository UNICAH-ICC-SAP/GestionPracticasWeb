
import React from 'react'

import { maskPhone, maskCurrency, maskDNI } from './utils'
import { Input } from 'reactstrap'
import { InputProps } from 'reactstrap/types/lib/Input'
import styled from 'styled-components'

const CustomInput = styled(Input)`
`

interface Props extends InputProps {
    mask: 'phone' | 'currency' | 'DNI' | 'employee';
    inputMaskChange: (text: React.ChangeEvent<HTMLInputElement>) => void;
    length?: number;
}
enum TypeInput {
    phone = 'phone',
    currency = 'currency',
    dni = 'DNI',
    employee = 'employee'
}
function MaskedInput({ mask, inputMaskChange, ...rest }: Props) {
    function handleChange(text: React.ChangeEvent<HTMLInputElement>) {
        if (mask === TypeInput.phone) {
            text.currentTarget.value = maskPhone(text.currentTarget.value);
            inputMaskChange(text);
        }
        if (mask === TypeInput.currency) {
            text.currentTarget.value = maskCurrency(text.currentTarget.value);
            inputMaskChange(text);
        }
        if (mask === TypeInput.dni) {
            text.currentTarget.value = maskDNI(text.currentTarget.value);
            inputMaskChange(text);
        }
        if (mask === TypeInput.employee) {
            text.currentTarget.value = maskDNI(text.currentTarget.value);
            inputMaskChange(text);
        }
    }

    return (<CustomInput
        onChange={handleChange}
        {...rest}
    />
    )
}

export default MaskedInput;