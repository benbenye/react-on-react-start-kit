/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Contact from './Contact';

export default {

  path: '/contact',

  async action() {
    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        mdoe:'cors'
      },
      body: JSON.stringify({
        query: '{news{name}}',
      }),
      credentials: 'include'
    });
    const { data } = await resp.json();
    console.log(data)
    if (!data || !data.news) throw new Error('Failed to load the news feed.');
    return <Contact news={data.news} />;
	},
};
