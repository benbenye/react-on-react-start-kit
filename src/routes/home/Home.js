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
import s from './Home.scss';
import Banner from '../../components/banner/Banner'

const title = 'React Starter Kit';
const none = {
  display: "none"
}
const ml500 = {
  marginLeft : '500px'
}
function Home({ news }, context) {
  context.setTitle(title);
  return (
    <div className={s.container}>
      <Banner />
      <div className={s.root,s['main-container']}>
        <div className={s.container}>
          <h1 className={s.title}>React.js News</h1>
          <ul className={s.news}>
            {news.map((item, index) => (
              <li key={index} classNamev={s.newsItem}>
                <span
                  className={s.newsDesc}
                  dangerouslySetInnerHTML={{ __html: item.name }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

Home.propTypes = {
  news: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    contentSnippet: PropTypes.string,
  })).isRequired,
};
Home.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Home);
