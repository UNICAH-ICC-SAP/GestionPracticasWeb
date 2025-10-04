import React from 'react';

import { Selector as SelectorUser } from '../../store/slices/users';

import { MenuItems } from '@components/shared/nav/menu';
import { Link } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './home.css';
import { useSelector } from '@store/index';

export const Home: React.FC = () => {
  const userInfo = useSelector(SelectorUser.getUser);
  console.log(1 - userInfo.roleId);
  return (
    <>
      <div className="fondo">
        <div className="container mt-5">
          <div className="row text-center">
            {MenuItems[userInfo.roleId - 1].map((item, index) => (
              <div className="col-md-6 mb-3" key={index}>
                <Link to={item.pathTo} className="btn btn-dark w-75">
                  {item.title}{" "}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};