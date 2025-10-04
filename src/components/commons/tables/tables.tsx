import React, { useState, useEffect } from 'react';
import { Pagination, PaginationItem, PaginationLink, Table } from "reactstrap"
import { DEF, Props } from '@root/Api/typesProps';

export type PropsTable = {
    headers: string[];
    data: Array<object>;
    paginated: boolean;
    children?: JSX.Element;
    firstColumnIndex: number;
};

export type PropsPagination = {
    onClickPrev: () => void;
    onClickNext: () => void;
};

export function Tables(props: Props<PropsTable, typeof DEF>) {
    const { headers, data, paginated, children, firstColumnIndex } = props;
    const propsObj = Object.keys(data[0]);
    const objectProps = propsObj.slice(firstColumnIndex, propsObj.length);
    const [init, setInit] = useState<number>(0);
    const [end, setEnd] = useState<number>(10);
    const [dataSliced, setDataSliced] = useState<object[]>(data);

    useEffect(() => {
        if (paginated) {
            const slicedData = data.slice(init, end);
            setDataSliced(slicedData);
        } else {
            setDataSliced(data);
        }
    }, [init, end, data, paginated]);

    const prev = () => {
        if (init > 0) {
            setInit(init - 10);
            setEnd(end - 10);
        }
    };

    const next = () => {
        if (end < data.length) {
            setInit(init + 10);
            setEnd(end + 10);
        }
    };

    return (
        <React.Fragment>
            <Table striped hover bordered>
                <thead>
                    <tr>
                        {headers && headers.map((item, index) => (
                            <th key={index}>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dataSliced && dataSliced.map((item, index) => (
                        <tr key={index}>
                            {objectProps.map((itemProp, index) => (
                                <td key={index} scope="row">
                                    {item[itemProp]}
                                </td>
                            ))}
                            {children && children}
                        </tr>
                    ))}
                </tbody>
            </Table>
            {paginated && <PaginationBlock onClickNext={next} onClickPrev={prev} />}
        </React.Fragment>
    );
}




function PaginationBlock(props: Props<PropsPagination, typeof DEF>) {
    const { onClickNext, onClickPrev } = props
    return <Pagination className='justify-content-center'>
        <PaginationItem>
            <PaginationLink
                onClick={onClickPrev}
                previous
            >Anterior</PaginationLink>
        </PaginationItem>
        <PaginationItem>
            <PaginationLink
                onClick={onClickNext}
                next
            >Siguiente</PaginationLink>
        </PaginationItem>
    </Pagination>
}
