import { Fragment, useState, useEffect } from 'react';
import { Pagination, PaginationItem, PaginationLink, Table } from "reactstrap"
import { DEF, Props } from '../../../Api/typesProps';
import React from 'react';


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
    const hasIndexColumn = firstColumnIndex > 0 ? true : false;
    const propsObj = Object.keys(data[0]);
    const objectProps = propsObj.slice(firstColumnIndex, propsObj.length);
    console.log(objectProps)
    const [init, setInit] = useState<number>(0);
    const [end, setEnd] = useState<number>(10);
    const [dataSliced, setDataSliced] = useState<object[]>();
    const prev = () => {
        let inicio = 0;
        let fin = 10;
        inicio = (init === 0) ? 0 : init - 10;
        fin = (end === 10) ? 10 : end - 10
        setInit(inicio);
        setEnd(fin);
    }
    const next = () => {
        let inicio = 0;
        let fin = 10;
        fin = (end === data.length) ? end : end + 10
        inicio = (init === fin - 10) ? fin - 10 : init + 10;
        setInit(inicio);
        setEnd(fin);
    }
    useEffect(() => {
        const slicedData = data.slice(init, end)
        setDataSliced(slicedData)
    }, [init, end, data])
    console.log(hasIndexColumn, firstColumnIndex)
    return <Fragment>
        <Table striped hover bordered>
            <thead>
                <tr>
                    {headers && headers.map((item, index) => {
                        return <th key={index}>{item}</th>
                    })
                    }
                </tr>
            </thead>
            <tbody>
                {dataSliced && dataSliced.map((item, index) => {
                    console.log(item)
                    return <tr key={index}>
                        {objectProps && objectProps.map((itemProp, index) => {
                            return <td key={index} scope="row">
                                {item[itemProp]}
                            </td>
                        })
                        }
                        {children && children}
                    </tr>
                })}
            </tbody>
        </Table>
        {paginated && <PaginationBlock onClickNext={next} onClickPrev={prev} />}
    </Fragment>
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
