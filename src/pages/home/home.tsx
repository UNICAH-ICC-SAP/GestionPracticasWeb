import React from 'react';

import { navigation, } from '@components/shared/nav/menu';
import type { NavigationItem } from '@components/shared/nav/types';
import { Link } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './home.css';
import {
  Selector as SelectorUser
} from "../../store/slices/users";
import { useSelector } from '@store/index';

export const Home: React.FC = () => {
  const [menuItem, setMenuItems] = React.useState<NavigationItem[] | null>(null);
  const roles = useSelector(SelectorUser.getRoles);
  const permissions = useSelector(SelectorUser.getPermissions);

  React.useEffect(() => {
    if (roles && roles.length > 0) {
      const userPermissionsSet = new Set(
        roles.map(p => p?.permission)
      );

      const nav = navigation.filter(item =>
        item?.permission && userPermissionsSet.has(item.permission)
      );
      setMenuItems([...nav])
    }
    if (permissions && permissions.length > 0) {
      const userPermissionsSet = new Set(
        permissions
          .filter(p => p?.permissionType === 'ALLOW')
          .map(p => p?.permission)
      );
      const nav = navigation.filter(item =>
        item?.permission && userPermissionsSet.has(item.permission)
      );
      setMenuItems(prev => [...prev, ...nav])
    }
  }, [roles, permissions])

  return (
    <>
      <div className="fondo">
        <div className="container mt-5">
          <div className="row text-center">
            {menuItem?.length > 0 && menuItem.map((item, index) => (
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