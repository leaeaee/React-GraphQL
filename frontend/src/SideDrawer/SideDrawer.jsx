import React from 'react';
import './SideDrawer.css';

const SideDrawer = props => {
    let drawerClasses = 'side-drawer';
    if(props.show){
        drawerClasses = 'side-drawer open';
    }
        return(
            <div>
                <nav className={drawerClasses}>
                    <ul>
                        <li><a href="/">Men</a></li>
                        <li><a href="/">Women</a></li>
                        <li><a href="/">Kids</a></li>
                    </ul>
                </nav>
            </div>
        );
    };

export default SideDrawer;
