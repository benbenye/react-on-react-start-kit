/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLList as List } from 'graphql';
import fetch from '../../core/fetch';
import NewsItemType from '../types/NewsItemType';

// React.js News Feed (RSS)
// const url = 'http://ajax.googleapis.com/ajax/services/feed/load' +
            // '?v=1.0&num=10&q=https://reactjsnews.com/feed.xml';
const url = 'http://api.dev.chunbo.com/Home/newindex';
let items = [];
let lastFetchTask;
let lastFetchTime = new Date(1970, 0, 1);

const news = {
  type: new List(NewsItemType),
  resolve() {
    if (lastFetchTask) {
      return lastFetchTask;
    }

    if ((new Date() - lastFetchTime) > 1000 * 60 * 10 /* 10 mins */) {
      lastFetchTime = new Date();
      lastFetchTask = fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.flag === 1) {
            console.error(data)
            items = data.data.list_focus;
          }
          // items = [{name:'mamade'}]

          return items;
        })
        .finally(() => {
          lastFetchTask = null;
        });

      if (items.length) {
        return items;
      }

      return lastFetchTask;
    }

    return items;
  },
};

export default news;
