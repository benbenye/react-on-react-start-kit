/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Banner.scss';

function Banner({banner})  { 

  return (
    <div className={s.banner}>
         <ul>
          {banner.map((item, index) => (
            <li key={index}>
              <a
                href="asd"
              />
            </li>
          ))}
         </ul>
    </div>
    )

}
export default withStyles(s)(Banner);
