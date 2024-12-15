import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

interface BreadcrumbProps {
    items: Array<{ title: string }>;
}

const Breadcrumbs: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <Breadcrumb className="pt-3">
            {items.map((item, index) => (
                <BreadcrumbItem key={index} active={index === items.length - 1}>
                    {item.title}
                </BreadcrumbItem>
            ))}
        </Breadcrumb>
    );
}

export default Breadcrumbs;
