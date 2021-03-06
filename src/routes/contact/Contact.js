/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Contact.scss';

const title = 'Contact Us for test CB addressSwitch';
const none = {
	display:none
}
function Contact({ news }, context) {
  context.setTitle(title);
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>{title}</h1>
        <ul className={s.news}>
          {news.map((item, index) => (
            <li key={index} className={s.newsItem}>
              <span
                className={s.newsDesc}
                dangerouslySetInnerHTML={{ __html: item.name }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

Contact.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Contact);
