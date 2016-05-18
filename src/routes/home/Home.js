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
    <div className={s.root,s.container}>
      <div className={s.container}>
        <h1 className={s.title}>React.js News</h1>
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

      <div className="distribution-box">
          <div className="distribution-selector">
              <div className="content">
                  <ul className="tab-tit">
                      <li className="city on tabProvince" id="tabProvince">
                          <span>请选择</span>
                          <i className="tri" />
                      </li>
                      <li className="district tabCity" id="tabCity" style={none}>
                        <span>请选择</span>
                          <i className="tri" />
                      </li>
                      <li className="district tabDistrict" id="tabDistrict" style={none}>
                          <span>请选择</span>
                          <i className="tri" />
                      </li>
                  </ul>
                  <ul className="tab-con city provinceList" id="provinceList" />
                  <ul className="tab-con district cityList" style={none} id="cityList" />
                  <ul className="tab-con district districtList" style={none} id="districtList" />
              </div>
          </div>
      </div>
      <div className="distribution-box" style={ml500}>
          <div className="distribution-selector">
              <div className="dis-text" id="address-text">
                <span>请选择</span>
                <i className="tri" />
              </div>
              <div className="content" id="product-address">
                  <ul className="tab-tit">
                      <li className="city on tabProvince">
                        <span>请选择</span>
                        <i className="tri" />
                      </li>
                      <li className="district tabCity" style={none}>
                        <span>请选择</span>
                        <i className="tri" />
                      </li>
                      <li className="district tabDistrict" style={none}>
                        <span>请选择</span>
                        <i className="tri" />
                      </li>
                  </ul>
                  <ul className="tab-con city provinceList" />
                  <ul className="tab-con district cityList" style={none} />
                  <ul className="tab-con district districtList" style={none} />
              </div>
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
